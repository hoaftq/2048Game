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
  upload_path = "../../../game"
}

output "domain_name" {
  description = "cloudfront domain name"
  value       = module.cloudfront.domain_name
}
