terraform {
  cloud {
    organization = "hoaftq"
    workspaces {
      name = "game2048"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"

  default_tags {
    tags = {
      "UsedBy"      = "game2048"
      "ManagedBy"   = "terraform"
      "Environment" = "production"
    }
  }
}

module "cloudfront" {
  source = "../../modules/cloudfront"

  origin_id   = "game2048"
  upload_path = "../../../game/dist"
}

output "domain_name" {
  description = "cloudfront domain name"
  value       = module.cloudfront.domain_name
}
