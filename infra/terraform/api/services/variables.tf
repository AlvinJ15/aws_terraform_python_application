data "terraform_remote_state" "shared_services" {
  backend = "s3"
  config = {  # Corrected syntax: No quotes around "s3"
    bucket = "Org"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

locals {
  rest_api = data.terraform_remote_state.shared_services.outputs.rest_api
}

variable "api_status_response" {
  description = "API http status response"
  type        = list(string)
  default     = ["200", "500"]
}

variable "aws_region" {}

variable "cognito_user_arn" {}

variable "account_id" {}

variable "secret_manager_name" {}

variable "env" {}

variable "project_name" {
  default   = "Org"
}
