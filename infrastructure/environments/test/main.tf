terraform {
  backend "s3" {
    bucket         = "game2048-terraform-state"
    region         = "ap-southeast-1"
    key            = "test/terraform.tfstate"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = "ap-southeast-1"

  default_tags {
    tags = {
      "UsedBy"      = "game2048"
      "ManagedBy"   = "terraform"
      "Environment" = "test"
    }
  }
}

module "cloudfront" {
  source = "../../modules/cloudfront"

  origin_id   = "game2048-test"
  upload_path = "../../../game/dist"
}

output "domain_name" {
  description = "cloudfront domain name"
  value       = module.cloudfront.domain_name
}
