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

        stage('AI Risk Summary') {
            steps {
                sh """
                REPORT=\$(cat trivy-report/report.txt | head -c 6000)
                curl -s -m 60 -X POST http://localhost:11434/api/generate \
                -H "Content-Type: application/json" \
                -d "\$(jq -n --arg data "\$REPORT" '{model:"llama3.2", stream:false, prompt:("You are a security assistant. Read this Trivy vulnerability scan report and: 1) List only CRITICAL vulnerabilities that need immediate fixing 2) Give a one-line summary for the rest. Keep it short and clear.\\n\\n" + \$data)}')" \
                | jq -r '.response' > trivy-report/ai-summary.txt
                echo "===== AI RISK SUMMARY ====="
                cat trivy-report/ai-summary.txt
            """
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
