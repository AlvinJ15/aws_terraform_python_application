
locals {
  base_path = "organizations"
  methods_names = {
    get_single_organizations = {
      lambda_name = "GetSingleOrganizations"
      handler   = "api_services/organizations/organizations_management.get_single_handler"
      path      = "{organization_id}"
      method    = "GET"
      responses = var.api_status_response
      resource  = "id_resource"
    }
  }
}

resource "aws_api_gateway_resource" "base_resource_organization" {
  rest_api_id = var.rest_api.id
  parent_id   = var.env_resource.id
  path_part   = "organizations"
}

resource "aws_api_gateway_resource" "id_resource_organization" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_resource_organization.id
  path_part   = "{organization_id}"
}

locals {
  resources = {
    base_resource = aws_api_gateway_resource.base_resource_organization
    id_resource   = aws_api_gateway_resource.id_resource_organization
  }
}

module "organization_cors" {
  for_each = local.resources

  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id = var.rest_api.id
  api_resource_id =each.value.id
}

resource "aws_api_gateway_method" "methods_organizations" {
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

resource "aws_api_gateway_integration" "integration_organizations" {
  for_each = local.methods_names

  rest_api_id             = var.rest_api.id
  resource_id             = local.resources[each.value.resource].id
  http_method             = aws_api_gateway_method.methods_organizations[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function_organizations[each.key].invoke_arn
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

resource "aws_api_gateway_method_response" "response_organizations" {
  for_each = local.flat_map

  rest_api_id = var.rest_api.id
  resource_id = local.resources[each.value.resource].id
  http_method = aws_api_gateway_method.methods_organizations[each.value.method_name].http_method
  status_code = each.value.status
}