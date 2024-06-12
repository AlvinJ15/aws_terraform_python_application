module "organization_management" {
  source                   = "./organization_management"
  env                      = var.env
  rest_api                 = local.rest_api
  env_resource             = aws_api_gateway_resource.env_resource
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  project_name             = var.project_name
}

module "facility_management" {
  source                   = "./facility_management"
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
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
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "conversation_management" {
  source                   = "./conversation_management"
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_organization = module.organization_management.base_organizations_id_resource
}

module "user_conversation_management" {
  source                   = "./user_conversation_management"
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_employee     = module.employee_management.base_employees_id_resource
}

module "message_management" {
  source                   = "./message_management"
  env                      = var.env
  rest_api                 = local.rest_api
  project_name             = var.project_name
  api_status_response      = var.api_status_response
  account_id               = var.account_id
  api_authorizer           = aws_api_gateway_authorizer.api_authorizer
  aws_region               = var.aws_region
  cognito_user_arn         = var.cognito_user_arn
  lambda_exec              = aws_iam_role.lambda_exec
  id_resource_conversation = module.conversation_management.base_conversations_id_resource
}

module "employee_reference_submission" {
  source                   = "./lambda_functions/process_reference_evaluation_submissions"
  env                      = var.env
  project_name             = var.project_name
  lambda_exec              = aws_iam_role.lambda_exec
}

module "expiry_soon_employees_documents" {
  source                   = "./lambda_functions/process_expiring_soon_employee_documents"
  env                      = var.env
  project_name             = var.project_name
  lambda_exec              = aws_iam_role.lambda_exec
}

module "expired_employees_documents" {
  source                   = "./lambda_functions/process_expired_employee_documents"
  env                      = var.env
  project_name             = var.project_name
  lambda_exec              = aws_iam_role.lambda_exec
}

module "inbound_messages_sms_clicksend" {
  source                   = "./lambda_functions/process_inbound_messages_sms_clicksend"
  env                      = var.env
  project_name             = var.project_name
  lambda_exec              = aws_iam_role.lambda_exec
}

module "database_gateway" {
  source                   = "./lambda_functions/database_gateway"
  env                      = var.env
  project_name             = var.project_name
  lambda_exec              = aws_iam_role.lambda_exec
}