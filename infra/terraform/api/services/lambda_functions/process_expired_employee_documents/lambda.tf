module "lambda_layers" {
  source = "../../layers"
}

module "source_code" {
  source = "../../source_code"
}

resource "aws_lambda_function" "lambda_function_expired_employees_documents" {
  function_name    = "${var.project_name}-ExpiredEmployeesDocuments-${title(var.env)}"
  filename         = module.source_code.source_code_package.output_path
  source_code_hash = module.source_code.source_code_package.output_base64sha256
  role             = var.lambda_exec.arn
  runtime          = "python3.10"
  handler          = "api_services/lambdas_functions/lambda_documents_expired.expired_handler"
  depends_on       = [module.lambda_layers]
  layers           = [module.lambda_layers.layer_arn]
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

resource "aws_cloudwatch_event_rule" "lambda_invocation_expired_employees_documents" {
  name                = "daily_expired_employees_documents"
  description         = "Invokes Lambda function daily at 5:00 AM (UTC) ~ 00:00 EST"
  schedule_expression = "cron(0 5 ? * * *)"
}

resource "aws_cloudwatch_event_target" "schedule_lambda" {
    rule = aws_cloudwatch_event_rule.lambda_invocation_expired_employees_documents.name
    target_id = "processing_lambda_expired_employees_documents"
    arn = aws_lambda_function.lambda_function_expired_employees_documents.arn
}

resource "aws_lambda_permission" "secretsmanager_access_employee_documents" {
  statement_id  = "AllowSecretsManagerAccess"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_expired_employees_documents.function_name
  principal     = "secretsmanager.amazonaws.com"
}

resource "aws_lambda_permission" "allow_events_bridge_to_run_lambda" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.lambda_function_expired_employees_documents.function_name
    principal = "events.amazonaws.com"
}
