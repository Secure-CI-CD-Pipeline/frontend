pipeline {
    agent any
    environment {
        IMAGE_NAME = "sampadasupriya/secure-event-client"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
        SONARQUBE_ENV = "SonarQube"
        DOCKER_CREDS = "dockerhub-credentials"
    }
    tools {
        nodejs "NodeJS"
    }
    stages {
        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Static Code Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=secure-event-client \
                        -Dsonar.projectName=secure-event-client \
                        -Dsonar.sources=. \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh """
                docker build \
                --build-arg VITE_API_URL=/api \
                -t ${IMAGE_NAME}:${IMAGE_TAG} \
                .
                """
            }
        }
        stage('Trivy Vulnerability Scan') {
            steps {
                sh """
                mkdir -p trivy-report
                trivy image \
                --severity HIGH,CRITICAL \
                --exit-code 0 \
                --format table \
                --output trivy-report/report.txt \
                ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
        stage('Archive Trivy Report') {
            steps {
                archiveArtifacts artifacts: 'trivy-report/report.txt'
            }
        }
        stage('Push Docker Image') {
            steps {
                withDockerRegistry(
                    credentialsId: "${DOCKER_CREDS}",
                    url: ''
                ) {
                    sh """
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
    post {
        success {
            echo "CI Pipeline Completed Successfully."
        }
        failure {
            echo "Pipeline Failed."
        }
        always {
            cleanWs()
        }
    }
}
