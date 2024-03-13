module "organization_management" {
  source                   = "./organization_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
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

module "organization_document_management" {
  source                   = "./organization_document_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "employee_management" {
  source                   = "./employee_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "employee_document_management" {
  source                   = "./employee_document_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_employee     = module.employee_management.base_employees_id_resource
}

module "employee_questionnaire_response_management" {
  source                   = "./employee_questionnaire_response_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_employee     = module.employee_management.base_employees_id_resource
}

module "employee_reference_management" {
  source                   = "./employee_reference_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_employee     = module.employee_management.base_employees_id_resource
}

module "administrator_management" {
  source                   = "./administrator_management"
  rest_api                 = aws_api_gateway_rest_api.rest_api
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "employee_reference_submission" {
  source                   = "./lambda_functions/process_reference_evaluation_submissions"
  lambda_exec              = aws_iam_role.lambda_exec
}

module "expiry_soon_employees_documents" {
  source                   = "./lambda_functions/process_expiring_soon_employee_documents"
  lambda_exec              = aws_iam_role.lambda_exec
}