provider "aws" {
  region = var.aws_region
  alias  = "dev"
  default_tags {
    tags = {
      environment = "dev"
    }
  }
}

provider "aws" {
  region = var.aws_region
  alias  = "prod"
  default_tags {
    tags = {
      environment = "prod"
    }
  }
}

provider "aws" {
  region = var.aws_region
  alias  = "stage"
  default_tags {
    tags = {
      environment = "stage"
    }
  }
}

module "role_management" {
  source              = "./role_management"
  rest_api            = aws_api_gateway_rest_api.rest_api
  api_status_response = var.api_status_response
  account_id          = var.account_id
  api_authorizer      = aws_api_gateway_authorizer.api_authorizer
  aws_region          = var.aws_region
  cognito_user_arn    = var.cognito_user_arn
  lambda_exec         = aws_iam_role.lambda_exec
}
