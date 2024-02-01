
provider "aws" {
  region = var.aws_region
  alias  = "dev"
  default_tags {
    tags = {
      environment = "dev"
    }
  }
}

provider "aws" {
  region = var.aws_region
  alias  = "prod"
  default_tags {
    tags = {
      environment = "prod"
    }
  }
}

provider "aws" {
  region = var.aws_region
  alias  = "stage"
  default_tags {
    tags = {
      environment = "stage"
    }
  }
}
