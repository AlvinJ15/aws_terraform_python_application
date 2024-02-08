module "api" {
  source           = "./api"
  account_id       = var.account_id
  aws_region       = var.aws_region
  cognito_user_arn = var.cognito_user_arn
  secret_manager_name = var.secret_manager_name
}
