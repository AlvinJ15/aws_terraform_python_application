resource "aws_api_gateway_resource" "env_resource" {
  rest_api_id = local.rest_api.id
  parent_id   = local.rest_api.root_resource_id
  path_part   = var.env
}

resource "aws_api_gateway_authorizer" "api_authorizer" {
  name          = "CognitoUserPoolAuthorizer-${title(var.env)}"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = local.rest_api.id
  provider_arns = [var.cognito_user_arn] # GET from AWS cognito pool
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = local.rest_api.id
  depends_on  = [
    module.organization_management,
    module.facility_management,
    module.document_type_management,
    module.compliance_package_management,
    module.questionnaire_management,
    module.onboarding_management,
    module.organization_document_management,
    module.employee_management,
    module.employee_document_management,
    module.employee_questionnaire_response_management,
    module.employee_reference_management,
    module.administrator_management,
    module.conversation_management,
    module.message_management,
    module.user_conversation_management
  ]

  stage_name        = "prod"
  stage_description = "Deployed at ${timestamp()}"

  lifecycle {
    create_before_destroy = true
  }
}

/*resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "v1"
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}*/


resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${local.rest_api.name}-${title(var.env)}"

  retention_in_days = 90
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda-${title(var.env)}"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "lambda_access" {
  bucket = "tollacred"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::${var.account_id}:role/serverless_lambda-Prod",
          "arn:aws:iam::${var.account_id}:role/serverless_lambda-Dev"
        ]
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::tollacred",
        "arn:aws:s3:::tollacred/*"
      ]
    }
  ]
}
EOF
}


resource "aws_iam_policy" "lambda_policy_secrets" {
  name = "my-lambda-policy-secret-${title(var.env)}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:${var.aws_region}:${var.account_id}:secret:tollaniscred_auto_stage-S0EWSH",
        "arn:aws:secretsmanager:${var.aws_region}:${var.account_id}:secret:tollaniscred_auto_dev-LqRD2e",
        "arn:aws:secretsmanager:${var.aws_region}:${var.account_id}:secret:tollacred_auto-vTGnv5",
        "arn:aws:secretsmanager:${var.aws_region}:${var.account_id}:secret:Paperform_access_token-B9wnrv",
        "arn:aws:secretsmanager:${var.aws_region}:${var.account_id}:secret:click_send_credentials-6tOON8"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy_interface" {
  name = "my-lambda-policy-interface-${title(var.env)}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy_ses" {
  name = "my-lambda-policy-ses-${title(var.env)}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

locals {
  db_user = var.env == "prod" ? "tollacred_auto" : format("tollaniscred_auto_%s", var.env)
}

resource "aws_iam_policy" "lambda_policy_rds" {
  name = "my-lambda-policy-rds-${title(var.env)}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds-db:connect"
      ],
      "Resource": "arn:aws:rds-db:${var.aws_region}:${var.account_id}:dbuser:*/${local.db_user}"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "my_lambda_calls_lambda" {
  name = "my-lambda-policy-calls-lambda-${title(var.env)}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "lambda:InvokeFunction",
      "Resource": [
        "arn:aws:lambda:${var.aws_region}:${var.account_id}:function:${var.project_name}-DatabaseGateway-${title(var.env)}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment_lambda" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.my_lambda_calls_lambda.arn
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment_interface" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy_interface.arn
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment_secrets" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy_secrets.arn
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment_ses" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy_ses.arn
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment_rds" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy_rds.arn
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
