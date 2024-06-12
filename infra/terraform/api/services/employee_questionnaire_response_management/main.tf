locals {
  base_path = "questionnaires"
  methods_names = {
    get_all_employee_questionnaire_responses = {
      lambda_name = "GetAllEmployeeQuestionnaireResponses"
      handler   = "api_services/employee_questionnaire_responses/employee_questionnaire_responses_management.get_all_handler"
      path      = ""
      method    = "GET",
      responses = var.api_status_response
      resource  = "base_resource"
    }
    get_single_employee_questionnaire_responses = {
      lambda_name = "GetSingleEmployeeQuestionnaireResponses"
      handler   = "api_services/employee_questionnaire_responses/employee_questionnaire_responses_management.get_single_handler"
      path      = "{response_id}"
      method    = "GET"
      responses = var.api_status_response
      resource  = "id_resource"
    }
    create_employee_questionnaire_responses = {
      lambda_name = "CreateEmployeeQuestionnaireResponses"
      handler   = "api_services/employee_questionnaire_responses/employee_questionnaire_responses_management.create_handler"
      path      = ""
      method    = "POST"
      responses = var.api_status_response
      resource  = "base_resource"
    }
    update_employee_questionnaire_responses = {
      lambda_name = "UpdateEmployeeQuestionnaireResponses"
      handler   = "api_services/employee_questionnaire_responses/employee_questionnaire_responses_management.update_handler"
      path      = "{response_id}"
      method    = "PUT"
      responses = var.api_status_response
      resource  = "id_resource"
    }
    delete_single_employee_questionnaire_responses = {
      lambda_name = "DeleteSingleEmployeeQuestionnaireResponses"
      handler   = "api_services/employee_questionnaire_responses/employee_questionnaire_responses_management.delete_single_handler"
      path      = "{response_id}"
      method    = "DELETE"
      responses = var.api_status_response
      resource  = "id_resource"
    }
  }
}

resource "aws_api_gateway_resource" "base_resource_employee_questionnaire_responses" {
  rest_api_id = var.rest_api.id
  parent_id   = var.id_resource_employee.id
  path_part   = local.base_path
}

resource "aws_api_gateway_resource" "id_resource_employee_questionnaire_responses" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_resource_employee_questionnaire_responses.id
  path_part   = "{response_id}"
}

locals {
  resources = {
    base_resource = aws_api_gateway_resource.base_resource_employee_questionnaire_responses
    id_resource   = aws_api_gateway_resource.id_resource_employee_questionnaire_responses
  }
}

module "employee_questionnaire_responses_cors" {
  for_each = local.resources

  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id = var.rest_api.id
  api_resource_id =each.value.id
}

resource "aws_api_gateway_method" "methods_employee_questionnaire_responses" {
  for_each = local.methods_names

  rest_api_id   = var.rest_api.id
  resource_id   = local.resources[each.value.resource].id
  http_method   = each.value.method
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.api_authorizer.id

  request_parameters = {
    "method.request.path.proxy" = true,
  }
}

resource "aws_api_gateway_integration" "integration_employee_questionnaire_responses" {
  for_each = local.methods_names

  rest_api_id             = var.rest_api.id
  resource_id             = local.resources[each.value.resource].id
  http_method             = aws_api_gateway_method.methods_employee_questionnaire_responses[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function_employee_questionnaire_responses[each.key].invoke_arn
}

locals {
  flat = flatten([
    for map_key, map_value in local.methods_names : [
      for status in map_value.responses : {
        method_name = map_key
        resource    = map_value.resource
        status      = status
      }
    ]
  ])
  flat_map = {
    for i in local.flat : "${i.method_name}_${i.status}" => i
  }
}

resource "aws_api_gateway_method_response" "response_employee_questionnaire_responses" {
  for_each = local.flat_map

  rest_api_id = var.rest_api.id
  resource_id = local.resources[each.value.resource].id
  http_method = aws_api_gateway_method.methods_employee_questionnaire_responses[each.value.method_name].http_method
  status_code = each.value.status
}
