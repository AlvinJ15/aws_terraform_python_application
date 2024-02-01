output "function_name" {
  description = "Name of the Lambda function."
  value       = aws_lambda_function.test_lambda_function.function_name
}

output "api_gateway_url" {
  description = "URL to invoke the API"
  value       = aws_api_gateway_deployment.deployment.invoke_url
}
