module "organization_management" {
  source   = "./organization_management"
  rest_api = aws_api_gateway_rest_api.rest_api
}

module "role_management" {
  source                   = "./role_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "document_type_management" {
  source                   = "./document_type_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "compliance_package_management" {
  source                   = "./compliance_package_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "questionnaire_management" {
  source                   = "./questionnaire_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "onboarding_management" {
  source                   = "./onboarding_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}
