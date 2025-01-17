resource "aws_lambda_function" "lambda_function_employee_references" {
  for_each = local.methods_names

  function_name    = "${var.project_name}-${each.value.lambda_name}-${title(var.env)}"
  filename         = var.source_code.source_code_package.output_path
  source_code_hash = var.source_code.source_code_package.output_base64sha256
  role             = var.lambda_exec.arn
  runtime          = "python3.10"
  handler          = each.value.handler
  layers           = [var.lambda_layers.layer_arn]
  timeout          = 30

  vpc_config {
    ipv6_allowed_for_dual_stack = false
    security_group_ids          = [
      "sg-008841c028d39973f",
    ]
    subnet_ids = [
      "subnet-07cac23b9c6f23f17",
    ]
  }
}

resource "aws_lambda_permission" "permissions_employee_references" {
  for_each = local.methods_names

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_employee_references[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.account_id}:${var.rest_api.id}/*/${aws_api_gateway_method.methods_employee_references[each.key].http_method}${local.resources[each.value.resource].path}"
}

resource "aws_lambda_permission" "secretsmanager_access_employee_references" {
  for_each = local.methods_names

  statement_id  = "AllowSecretsManagerAccess"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_employee_references[each.key].function_name
  principal     = "secretsmanager.amazonaws.com"
}
