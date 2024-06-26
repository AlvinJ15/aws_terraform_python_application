locals {
  base_path = "files"
  methods_names = {
    get_all_file_explorer = {
      lambda_name = "GetAllFileExplorer"
      handler   = "api_services/file_explorer/file_explorer_management.get_all_handler"
      path      = ""
      method    = "GET",
      responses = var.api_status_response
      resource  = "base_resource"
    }
    get_single_file_explorer = {
      lambda_name = "GetSingleFileExplorer"
      handler   = "api_services/file_explorer/file_explorer_management.get_single_handler"
      path      = "{file_name}"
      method    = "GET"
      responses = var.api_status_response
      resource  = "id_resource"
    }
    create_file_explorer = {
      lambda_name = "CreateFileExplorer"
      handler   = "api_services/file_explorer/file_explorer_management.create_handler"
      path      = ""
      method    = "POST"
      responses = var.api_status_response
      resource  = "base_resource"
    }
    update_file_explorer = {
      lambda_name = "UpdateFileExplorer"
      handler   = "api_services/file_explorer/file_explorer_management.update_handler"
      path      = "{file_name}"
      method    = "PUT"
      responses = var.api_status_response
      resource  = "id_resource"
    }
    delete_single_file_explorer = {
      lambda_name = "DeleteSingleFileExplorer"
      handler   = "api_services/file_explorer/file_explorer_management.delete_single_handler"
      path      = "{file_name}"
      method    = "DELETE"
      responses = var.api_status_response
      resource  = "id_resource"
    }
  }
}

resource "aws_api_gateway_resource" "base_resource_file_explorer" {
  rest_api_id = var.rest_api.id
  parent_id   = var.id_resource_organization.id
  path_part   = local.base_path
}

resource "aws_api_gateway_resource" "id_resource_file_explorer" {
  rest_api_id = var.rest_api.id
  parent_id = aws_api_gateway_resource.base_resource_file_explorer.id
  path_part   = "{file_name}"
}

locals {
  resources = {
    base_resource = aws_api_gateway_resource.base_resource_file_explorer
    id_resource = aws_api_gateway_resource.id_resource_file_explorer
  }
}

module "file_explorer_cors" {
  for_each = local.resources

  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id = var.rest_api.id
  api_resource_id =each.value.id
}

resource "aws_api_gateway_method" "methods_file_explorer" {
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

resource "aws_api_gateway_integration" "integration_file_explorer" {
  for_each = local.methods_names

  rest_api_id             = var.rest_api.id
  resource_id             = local.resources[each.value.resource].id
  http_method             = aws_api_gateway_method.methods_file_explorer[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function_file_explorer[each.key].invoke_arn
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

resource "aws_api_gateway_method_response" "response_file_explorer" {
  for_each = local.flat_map

  rest_api_id = var.rest_api.id
  resource_id = local.resources[each.value.resource].id
  http_method = aws_api_gateway_method.methods_file_explorer[each.value.method_name].http_method
  status_code = each.value.status
}
