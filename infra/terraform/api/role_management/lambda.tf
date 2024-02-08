module "lambda_layers" {
  source = "../layers"
}

data "archive_file" "role_management_package" {
  type        = "zip"
  source_dir  = "${path.module}/../../../../src"
  output_path = "${path.module}/src_roles.zip"
}

resource "aws_lambda_function" "roles_lambda_function" {
  for_each = local.methods_names

  function_name    = each.key
  filename         = data.archive_file.role_management_package.output_path
  source_code_hash = data.archive_file.role_management_package.output_base64sha256
  role             = var.lambda_exec.arn
  runtime = "python3.11"
  handler          = each.value.handler
  depends_on       = [module.lambda_layers]
  layers           = [module.lambda_layers.layer_arn]
  timeout          = 10

  //TODO: Change fixed security groups IDs
  vpc_config {
    ipv6_allowed_for_dual_stack = false
    security_group_ids          = [
      "sg-008841c028d39973f",
    ]
    subnet_ids = [
      "subnet-0328e29f0b95a9e2a",
      "subnet-072e4e172ae80a2df",
      "subnet-07cac23b9c6f23f17",
      "subnet-07d26dce63c720ece",
      "subnet-089284206123d8f89",
      "subnet-09363689c90ca41aa",
      "subnet-0a31ff1dcc1a04f9c",
      "subnet-0aa10a76be4004e0b",
    ]
  }
}

resource "aws_lambda_permission" "roles_permissions" {
  for_each = local.methods_names

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.roles_lambda_function[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.account_id}:${var.rest_api.id}/*/${aws_api_gateway_method.roles_methods[each.key].http_method}${local.roles_resources[each.value.resource].path}"
}

resource "aws_lambda_permission" "secretsmanager_access" {
  for_each = local.methods_names

  statement_id  = "AllowSecretsManagerAccess"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.roles_lambda_function[each.key].function_name
  principal     = "secretsmanager.amazonaws.com"
}
