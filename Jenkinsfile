pipeline {
    agent any

    environment {
        IMAGE_NAME = "sampadasupriya/secure-event-client:v3-fixed"
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                sh 'docker --version'
            }
        }


        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Verify Docker Image') {
            steps {
                sh 'docker images | grep secure-event-client'
            }
        }

    }

    post {
        success {
            echo "Frontend Docker Image Built Successfully"
        }

        failure {
            echo "Frontend Pipeline Failed"
        }
    }
}
