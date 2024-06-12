data "archive_file" "source_code_package" {
  type        = "zip"
  source_dir  = "${path.module}/../../../../../src"
  output_path = "${path.module}/src_code.zip"
  excludes = ["tests"]
}
