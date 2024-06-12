module "api" {
  source              = "./api"
  aws_region          = var.aws_region
  cognito_user_arn    = var.cognito_user_arn
}
