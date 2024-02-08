output "api_gateway_url" {
  description = "URL to invoke the API"
  value       = aws_api_gateway_deployment.deployment.invoke_url
}
