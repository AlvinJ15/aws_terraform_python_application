#!/bin/bash
# terraform workspace new stage
echo "INITIAL INIT"
terraform init

echo "CHANGE DEFAULT WORKSPACE"
terraform workspace select default
echo "RUN TERRAFORM INIT DEFAULT"
terraform init
echo "RUN TERRAFORM APPLY DEFAULT"
terraform apply -auto-approve

cd api/services
export TF_VAR_env=stage

echo "INITIAL INIT"
terraform init
echo "CHANGE $TF_VAR_env WORKSPACE"
terraform workspace select stage
echo "RUN TERRAFORM INIT $TF_VAR_env"
terraform init
echo "RUN TERRAFORM APPLY $TF_VAR_env"
terraform apply -auto-approve
cd ../..