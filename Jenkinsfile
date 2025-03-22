node {
    terraformHome = tool name: 'terraform21207', type: 'terraform'
    env.PATH = "${env.PATH}:${terraformHome}"

    npmHome = tool name: 'nodejs14'
    env.PATH = "${env.PATH}:${npmHome}/bin"

    env.TF_IN_AUTOMATION = true
    env.TF_INPUT = false

    stage('Check out') {
        git branch: env.BRANCH_NAME, url: 'https://github.com/hoaftq/2048Game.git'
    }

    stage('Install packages') {
        dir('game') {
            sh 'npm install'
        }
    }

    stage('Build') {
        dir('game') {
            sh 'npm run build'
        }
    }

    withCredentials([string(credentialsId: 'app_terraform_io', variable: 'TF_TOKEN_app_terraform_io'),
                     aws(credentialsId: 'game2048_credentials')]) {
        envDir = 'infrastructure/environments/prod'

        stage('Terraform init') {
            dir(envDir) {
                sh 'terraform init'
            }
        }

        stage('Terraform validate') {
            dir(envDir) {
                sh 'terraform validate'
            }
        }

        stage('Terraform apply') {
            dir(envDir) {
                sh 'terraform apply -auto-approve'
            }
        }
    }
}
