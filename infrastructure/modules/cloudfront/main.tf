
resource "aws_s3_bucket" "origin_bucket" {
  bucket_prefix = "${var.origin_id}-"
}

data "aws_iam_policy_document" "origin_bucket_policy_document" {
  statement {
    sid = "AllowCloudFrontAccessS3Bucket"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.origin_bucket.arn}/*"]
    effect    = "Allow"

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "origin_bucket_policy" {
  bucket = aws_s3_bucket.origin_bucket.id
  policy = data.aws_iam_policy_document.origin_bucket_policy_document.json
}

resource "aws_cloudfront_origin_access_control" "default" {
  name                              = var.origin_id
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.origin_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = var.origin_id
  }

  enabled             = true
  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.origin_id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }
}

locals {
  extension_to_mime_types = {
    "html" = "text/html",
    "js"   = "text/javascript",
    "css"  = "text/css"
  }
}

resource "aws_s3_object" "uploaded_files" {
  bucket       = aws_s3_bucket.origin_bucket.id
  for_each     = fileset(var.upload_path, "**")
  key          = each.value
  source       = "${var.upload_path}/${each.value}"
  etag         = filemd5("${var.upload_path}/${each.value}")
  content_type = local.extension_to_mime_types[trimprefix(regex("\\.\\w+$", each.value), ".")]
}
