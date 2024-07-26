terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.23.1"
    }
  }

  backend "s3" {
    bucket = "Org"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }

  required_version = "~> 1.5.5"
}