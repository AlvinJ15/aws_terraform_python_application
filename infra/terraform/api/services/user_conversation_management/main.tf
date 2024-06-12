locals {
  base_path = "conversations"
  methods_names = {
    get_all_user_conversations = {
      lambda_name = "GetAllUserConversations"
      handler   = "api_services/user_conversations/user_conversations_management.get_all_handler"
      path      = ""
      method    = "GET",
      responses = var.api_status_response
      resource  = "base_resource"
    }
    create_user_conversations = {
      lambda_name = "CreateUserConversations"
      handler   = "api_services/user_conversations/user_conversations_management.create_handler"
      path      = ""
      method    = "POST"
      responses = var.api_status_response
      resource  = "base_resource"
    }
    update_user_conversations = {
      lambda_name = "UpdateUserConversations"
      handler   = "api_services/user_conversations/user_conversations_management.update_handler"
      path      = ""
      method    = "PUT"
      responses = var.api_status_response
      resource  = "base_resource"
    }
  }
}

resource "aws_api_gateway_resource" "base_resource_user_conversations" {
  rest_api_id = var.rest_api.id
  parent_id   = var.id_resource_employee.id
  path_part   = local.base_path
}


locals {
  resources = {
    base_resource = aws_api_gateway_resource.base_resource_user_conversations
  }
}

module "user_conversations_cors" {
  for_each = local.resources

  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id = var.rest_api.id
  api_resource_id =each.value.id
}

resource "aws_api_gateway_method" "methods_user_conversations" {
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

resource "aws_api_gateway_integration" "integration_user_conversations" {
  for_each = local.methods_names

  rest_api_id             = var.rest_api.id
  resource_id             = local.resources[each.value.resource].id
  http_method             = aws_api_gateway_method.methods_user_conversations[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function_user_conversations[each.key].invoke_arn
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

resource "aws_api_gateway_method_response" "response_user_conversations" {
  for_each = local.flat_map

  rest_api_id = var.rest_api.id
  resource_id = local.resources[each.value.resource].id
  http_method = aws_api_gateway_method.methods_user_conversations[each.value.method_name].http_method
  status_code = each.value.status
}
