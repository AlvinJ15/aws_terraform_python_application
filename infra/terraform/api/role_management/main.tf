locals {
  base_role_path = "roles"
  methods_names = {
    get_all_roles = {
      handler   = "api_services/roles/role_management.get_all_handler"
      path      = ""
      method    = "GET",
      responses = var.api_status_response
      resource  = "base_resource"
    }
    get_single_role = {
      handler   = "api_services/roles/role_management.get_single_handler"
      path      = "{role_id}"
      method    = "GET"
      responses = var.api_status_response
      resource  = "role_id_resource"
    }
    create_role = {
      handler   = "api_services/roles/role_management.create_handler"
      path      = ""
      method    = "POST"
      responses = var.api_status_response
      resource  = "base_resource"
    }
    update_role = {
      handler   = "api_services/roles/role_management.update_handler"
      path      = "{role_id}"
      method    = "PUT"
      responses = var.api_status_response
      resource  = "role_id_resource"
    }
  }
}

resource "aws_api_gateway_resource" "base_organizations_resource" {
  rest_api_id = var.rest_api.id
  parent_id   = var.rest_api.root_resource_id
  path_part   = "organizations"
}

resource "aws_api_gateway_resource" "base_organizations_id_resource" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_organizations_resource.id
  path_part   = "{organization_id}"
}

resource "aws_api_gateway_resource" "base_roles_resource" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_organizations_id_resource.id
  path_part   = local.base_role_path
}

resource "aws_api_gateway_resource" "role_id_resource" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_roles_resource.id
  path_part   = "{role_id}"
}

locals {
  roles_resources = {
    base_resource    = aws_api_gateway_resource.base_roles_resource
    role_id_resource = aws_api_gateway_resource.role_id_resource
  }
}

resource "aws_api_gateway_method" "roles_methods" {
  for_each = local.methods_names

  rest_api_id   = var.rest_api.id
  resource_id   = local.roles_resources[each.value.resource].id
  http_method   = each.value.method
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.api_authorizer.id

  request_parameters = {
    "method.request.path.proxy" = true,
  }
}

resource "aws_api_gateway_integration" "roles_integration" {
  for_each = local.methods_names

  rest_api_id             = var.rest_api.id
  resource_id             = local.roles_resources[each.value.resource].id
  http_method             = aws_api_gateway_method.roles_methods[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.roles_lambda_function[each.key].invoke_arn
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

resource "aws_api_gateway_method_response" "roles_response" {
  for_each = local.flat_map

  rest_api_id = var.rest_api.id
  resource_id = local.roles_resources[each.value.resource].id
  http_method = aws_api_gateway_method.roles_methods[each.value.method_name].http_method
  status_code = each.value.status
}
