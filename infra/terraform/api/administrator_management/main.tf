locals {
  base_path = "administrators"
  methods_names = {
    get_all_administrators = {
      handler   = "api_services/administrators/administrators_management.get_all_handler"
      path      = ""
      method    = "GET",
      responses = var.api_status_response
      resource  = "base_resource"
    },
    get_logged_user_id = {
      handler   = "api_services/administrators/administrators_management.get_logged_user_id"
      path      = ""
      method    = "GET",
      responses = var.api_status_response
      resource  = "current_administrator_resource"
    }
  }
}

resource "aws_api_gateway_resource" "base_resource_administrators" {
  rest_api_id = var.rest_api.id
  parent_id   = var.id_resource_organization.id
  path_part   = local.base_path
}

resource "aws_api_gateway_resource" "base_current_resource_administrator" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_resource_administrators.id
  path_part   = "current"
}

locals {
  resources = {
    base_resource = aws_api_gateway_resource.base_resource_administrators,
    current_administrator_resource = aws_api_gateway_resource.base_current_resource_administrator,
  }
}

resource "aws_api_gateway_method" "methods_administrators" {
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

resource "aws_api_gateway_integration" "integration_administrators" {
  for_each = local.methods_names

  rest_api_id             = var.rest_api.id
  resource_id             = local.resources[each.value.resource].id
  http_method             = aws_api_gateway_method.methods_administrators[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function_administrators[each.key].invoke_arn
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

resource "aws_api_gateway_method_response" "response_administrators" {
  for_each = local.flat_map

  rest_api_id = var.rest_api.id
  resource_id = local.resources[each.value.resource].id
  http_method = aws_api_gateway_method.methods_administrators[each.value.method_name].http_method
  status_code = each.value.status
}
