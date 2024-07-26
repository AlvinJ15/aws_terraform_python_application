resource "aws_lambda_function" "lambda_function_database_gateway" {
  function_name    = "${var.project_name}-DatabaseGateway-${title(var.env)}"
  filename         = var.source_code.source_code_package.output_path
  source_code_hash = var.source_code.source_code_package.output_base64sha256
  role             = var.lambda_exec.arn
  runtime          = "python3.10"
  handler          = "api_services/database_gateway/lambda_database_gateway.query_handler"
  layers           = [var.lambda_layers.layer_arn]
  timeout          = 30

  vpc_config {
    ipv6_allowed_for_dual_stack = false
    security_group_ids          = [
      "sg-008841c028d39973f",
    ]
    // unique subnet with a NAT Gateway associated to it, otherwise SES can't send mails
    subnet_ids = [
      "subnet-07cac23b9c6f23f17"
    ]
  }
  environment {
    variables = {
      STAGE = var.env
    }
  }
}

resource "aws_lambda_permission" "secretsmanager_access_database_gateway" {
  statement_id  = "AllowSecretsManagerAccess"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_database_gateway.function_name
  principal     = "secretsmanager.amazonaws.com"
}

resource "aws_lambda_permission" "allow_events_bridge_to_run_lambda" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.lambda_function_database_gateway.function_name
    principal = "events.amazonaws.com"
}
