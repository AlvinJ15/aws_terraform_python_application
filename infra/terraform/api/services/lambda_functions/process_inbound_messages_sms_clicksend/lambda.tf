resource "aws_lambda_function" "lambda_function_inbound_messages_sms_clicksend" {
  function_name    = "${var.project_name}-InboundMessagesSmsClicksend-${title(var.env)}"
  filename         = var.source_code.source_code_package.output_path
  source_code_hash = var.source_code.source_code_package.output_base64sha256
  role             = var.lambda_exec.arn
  runtime          = "python3.10"
  handler          = "api_services/messages/inbound_messages_sms_clicksend.inbound_sms_handler"
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
  environment {
    variables = {
      CLICK_SEND_FROM_NUMBER = "+18338412766"
    }
  }
}

resource "aws_lambda_function_url" "submission_public_url" {
  function_name      = aws_lambda_function.lambda_function_inbound_messages_sms_clicksend.function_name
  authorization_type = "NONE"
}

resource "aws_lambda_permission" "secretsmanager_access_inbound_messages_sms_clicksend" {
  statement_id  = "AllowSecretsManagerAccess"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_inbound_messages_sms_clicksend.function_name
  principal     = "secretsmanager.amazonaws.com"
}
