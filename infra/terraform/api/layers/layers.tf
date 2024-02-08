resource "terraform_data" "pip_install" {
  triggers_replace = {
    shell_hash = sha256(file("requirements.txt"))
  }

  provisioner "local-exec" {
    command = "mkdir -p ${path.module}/layer/python"
  }

  provisioner "local-exec" {
    command = "python3 -m pip install -r requirements.txt -t ${path.module}/layer/python"
  }
}

data "archive_file" "layer" {
  type        = "zip"
  source_dir  = "${path.module}/layer"
  output_path = "${path.module}/layer.zip"
  depends_on  = [terraform_data.pip_install]
}

resource "aws_lambda_layer_version" "lambda_api_dependencies" {
  layer_name          = "lambda_api_dependencies"
  filename            = data.archive_file.layer.output_path
  source_code_hash    = data.archive_file.layer.output_base64sha256
  compatible_runtimes = ["python3.11", "python3.10", "python3.9"]
}