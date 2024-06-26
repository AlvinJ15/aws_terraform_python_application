module "lambda_layers" {
  source = "../layers"
}

module "source_code" {
  source = "../source_code"
}

locals {
  organizations = {
    "0c53f3f8-5088-444a-a9e2-2c773a20fe6f": "Tollanis Payor",
    "2c8d5c83-eac7-4ec2-bb57-ca2631d5f0ae": "Elite 365 - Locums",
    "4c6e19a0-0a58-43f0-a12e-9d66eabe2265": "TrueCare Nursing Services",
    "5d552a6c-1bef-412f-a913-36c2326975a3": "Genevive",
    "9cf728c0-288a-4d92-9524-04d58b2ab32d": "Elite 365",
    "aed47a1f-0ab4-44be-a903-2fb3ca783980": "Pulse",
    "e5a88912-a95b-47a8-9a2f-f0f0594c7a3b": "Tollanis Demo"
  }
}

resource "aws_lambda_function" "lambda_function_file_explorer" {
  for_each = local.methods_names

  function_name    = "${var.project_name}-${each.value.lambda_name}-${title(var.env)}"
  filename         = module.source_code.source_code_package.output_path
  source_code_hash = module.source_code.source_code_package.output_base64sha256
  role             = var.lambda_exec.arn
  runtime          = "python3.10"
  handler          = each.value.handler
  depends_on       = [module.lambda_layers]
  layers           = [module.lambda_layers.layer_arn]
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
  environment {
    variables = {
      ORGANIZATIONS = jsonencode(local.organizations)
    }
  }
}

resource "aws_lambda_permission" "permissions_file_explorer" {
  for_each = local.methods_names

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_file_explorer[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.account_id}:${var.rest_api.id}/*/${aws_api_gateway_method.methods_file_explorer[each.key].http_method}${local.resources[each.value.resource].path}"
}

resource "aws_lambda_permission" "secretsmanager_access_file_explorer" {
  for_each = local.methods_names

  statement_id  = "AllowSecretsManagerAccess"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_file_explorer[each.key].function_name
  principal     = "secretsmanager.amazonaws.com"
}
