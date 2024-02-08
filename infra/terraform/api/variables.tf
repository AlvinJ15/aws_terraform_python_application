variable "api_status_response" {
  description = "API http status response"
  type        = list(string)
  default     = ["200", "500"]
}

variable "aws_region" {}

variable "cognito_user_arn" {}

variable "account_id" {}

variable "secret_manager_name" {}
