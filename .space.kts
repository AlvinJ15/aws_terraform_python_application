// DEVELOPMENT JOB

job("Run Build and Deploy for UI - DEVELOPMENT") {
    startOn {
        gitPush {
            // run only on changes in 'develop'
            anyBranchMatching {
                +"develop"
            }

            pathFilter {
                +"Org_MATERIALPRO/**"
            }
        }
    }

    git {
        // fetch 'develop' and tags to local history
        refSpec {
            +"refs/heads/develop"
        }
    }

    container(displayName = "Get param value from env variable", image = "doctrine/nodejs-aws-cli") {
        env["MY_SECRET"] = "{{ project:ENV_FILE_SECRET }}"
        env["PROJECT_NAME"] = "Orgapp"
        env["UI_FOLDER"] = "Org_MATERIALPRO"
        env["UI_DEVELOPMENT"] = "{{ project:SECRET_UI_DEV }}"
        env["CLOUD_FRONT_ID"] = "E73BZKFCO53N0"

        shellScript {
            interpreter = "/bin/bash"
            content = """
                pip install boto3
                cd /mnt/space/work/${'$'}PROJECT_NAME/${'$'}UI_FOLDER
                echo "${'$'}UI_DEVELOPMENT" > .env.development
                npm install

                echo "BUILD REACT PROJECT"
                npm run build-dev

                cd ../src/scripts
                export PYTHONPATH="${'$'}PYTHONPATH:$(pwd)/.."
                ${'$'}MY_SECRET
                unset AWS_SESSION_TOKEN
                aws configure set aws_access_key_id ${'$'}AWS_ACCESS_KEY_ID
                aws configure set aws_secret_access_key ${'$'}AWS_SECRET_ACCESS_KEY
                aws configure set region "${'$'}AWS_DEFAULT_REGION"

                echo "UPLOADING PROJECT FILES TO S3"
                python3 deploy_dev_site.py

                echo "RUN CLOUDFRONT INVALIDATION IN ${'$'}CLOUD_FRONT_ID"
                aws cloudfront create-invalidation --distribution-id ${'$'}CLOUD_FRONT_ID --paths "/*"
            """
        }
    }
}

job("Deploy API/terraform - DEVELOPMENT") {
    startOn {
        gitPush {
            // run only on changes in 'develop'
            anyBranchMatching {
                +"develop"
            }

            pathFilter {
                +"infra/**"
                +"src/**"
            }
        }
    }

    git {
        // fetch 'release' and tags to local history
        refSpec {
            +"refs/heads/develop"
        }
    }

    container(displayName = "Get param value from env variable", image = "python:3.10-bookworm") {
        env["MY_SECRET"] = "{{ project:ENV_FILE_SECRET }}"
        env["PROJECT_NAME"] = "Orgapp"

        shellScript {
            interpreter = "/bin/bash"
            content = """
                apk add --no-cache bash
                apt-get update && apt-get install -y gnupg software-properties-common
                wget -O- https://apt.releases.hashicorp.com/gpg | \
                gpg --dearmor | \
                tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
                gpg --no-default-keyring \
                --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
                --fingerprint
                echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
                https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
                tee /etc/apt/sources.list.d/hashicorp.list
                apt update
                apt-get install terraform
                apt-get install zip
                curl -L https://raw.githubusercontent.com/warrensbox/terraform-switcher/master/install.sh | bash
                tfswitch 1.5.5
                ls /usr/local/bin/
                echo "alias python=/usr/local/bin/python3.10" >> ~/.bashrc
                echo BASHRC:
                cat ~/.bashrc
                terraform --version
                pip --version
                python --version
                python3.10 --version
                zip --version
                cd /mnt/space/work/${'$'}PROJECT_NAME/infra/terraform
                ls -la
                echo "${'$'}MY_SECRET" > ENV.env
                chmod +x ENV.env
                source ENV.env
                aws configure set aws_access_key_id ${'$'}AWS_ACCESS_KEY_ID
                aws configure set aws_secret_access_key ${'$'}AWS_SECRET_ACCESS_KEY
                aws configure set region "${'$'}AWS_DEFAULT_REGION"

                echo "RUN TERRAFORM DEPLOY"
                TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
                echo "# Updated on: ${'$'}TIMESTAMP" >> api/services/requirements.txt
                cat api/services/requirements.txt
                mkdir -p api/services/layers/layer/python
                chmod +x deploy_DEV.sh
                ./deploy_DEV.sh
            """
        }
    }
}


// PRODUCTION JOB

job("Run Build and Deploy for UI - PRODUCTION") {
    startOn {
        gitPush {
            // run only on changes in 'main'
            anyBranchMatching {
                +"main"
            }

            pathFilter {
                +"Org_MATERIALPRO/**"
            }
        }
    }

    git {
        // fetch 'main' and tags to local history
        refSpec {
            +"refs/heads/main"
        }
    }

    container(displayName = "Get param value from env variable", image = "doctrine/nodejs-aws-cli") {
        env["MY_SECRET"] = "{{ project:ENV_FILE_SECRET }}"
        env["PROJECT_NAME"] = "Orgapp"
        env["UI_FOLDER"] = "Org_MATERIALPRO"
        env["UI_PRODUCTION"] = "{{ project:SECRET_UI_PROD }}"
        env["CLOUD_FRONT_ID"] = "E2X02VFWPPQWQI"

        shellScript {
            interpreter = "/bin/bash"
            content = """
                pip install boto3
                cd /mnt/space/work/${'$'}PROJECT_NAME/${'$'}UI_FOLDER
                echo "${'$'}UI_PRODUCTION" > .env.production
                npm install

                echo "BUILD REACT PROJECT"
                npm run build-prod

                cd ../src/scripts
                export PYTHONPATH="${'$'}PYTHONPATH:$(pwd)/.."
                ${'$'}MY_SECRET
                unset AWS_SESSION_TOKEN
                aws configure set aws_access_key_id ${'$'}AWS_ACCESS_KEY_ID
                aws configure set aws_secret_access_key ${'$'}AWS_SECRET_ACCESS_KEY
                aws configure set region "${'$'}AWS_DEFAULT_REGION"

                echo "UPLOADING PROJECT FILES TO S3"
                python3 deploy_prod_site.py

                echo "RUN CLOUDFRONT INVALIDATION IN ${'$'}CLOUD_FRONT_ID"
                aws cloudfront create-invalidation --distribution-id ${'$'}CLOUD_FRONT_ID --paths "/*"
            """
        }
    }
}

job("Deploy API/terraform - PRODUCTION") {
    startOn {
        gitPush {
            // run only on changes in 'main'
            anyBranchMatching {
                +"main"
            }

            pathFilter {
                +"infra/**"
                +"src/**"
            }
        }
    }

    git {
        // fetch 'main' and tags to local history
        refSpec {
            +"refs/heads/main"
        }
    }

    container(displayName = "Get param value from env variable", image = "python:3.10-bookworm") {
        env["MY_SECRET"] = "{{ project:ENV_FILE_SECRET }}"
        env["PROJECT_NAME"] = "Orgapp"

        shellScript {
            interpreter = "/bin/bash"
            content = """
                apk add --no-cache bash
                apt-get update && apt-get install -y gnupg software-properties-common
                wget -O- https://apt.releases.hashicorp.com/gpg | \
                gpg --dearmor | \
                tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
                gpg --no-default-keyring \
                --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
                --fingerprint
                echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
                https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
                tee /etc/apt/sources.list.d/hashicorp.list
                apt update
                apt-get install terraform
                apt-get install zip
                curl -L https://raw.githubusercontent.com/warrensbox/terraform-switcher/master/install.sh | bash
                tfswitch 1.5.5
                ls /usr/local/bin/
                echo "alias python=/usr/local/bin/python3.10" >> ~/.bashrc
                echo BASHRC:
                cat ~/.bashrc
                terraform --version
                pip --version
                python --version
                python3.10 --version
                zip --version
                cd /mnt/space/work/${'$'}PROJECT_NAME/infra/terraform
                ls -la
                echo "${'$'}MY_SECRET" > ENV.env
                chmod +x ENV.env
                source ENV.env
                aws configure set aws_access_key_id ${'$'}AWS_ACCESS_KEY_ID
                aws configure set aws_secret_access_key ${'$'}AWS_SECRET_ACCESS_KEY
                aws configure set region "${'$'}AWS_DEFAULT_REGION"

                echo "RUN TERRAFORM DEPLOY PRODUCTION"
                TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
                echo "# Updated on: ${'$'}TIMESTAMP" >> api/services/requirements.txt
                cat api/services/requirements.txt
                mkdir -p api/services/layers/layer/python
                chmod +x deploy_PROD.sh
                ./deploy_PROD.sh
            """
        }
    }
}