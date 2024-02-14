resource "aws_api_gateway_resource" "base_resource_organization" {
  rest_api_id = var.rest_api.id
  parent_id   = var.rest_api.root_resource_id
  path_part   = "organizations"
}

resource "aws_api_gateway_resource" "id_resource_organization" {
  rest_api_id = var.rest_api.id
  parent_id   = aws_api_gateway_resource.base_resource_organization.id
  path_part   = "{organization_id}"
}
