pipeline {
    agent any // Jenkins 빌드를 실행할 에이전트

    environment {
        // GitHub Personal Access Token (PAT) 자격 증명의 ID
        GIT_CREDENTIALS_ID = 'github-pat'
        
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    echo 'Cloning GitHub repository...'
                    git branch: 'dev', credentialsId: env.GIT_CREDENTIALS_ID, url: 'https://github.com/yuhyejin/bookitout.git'
                }
            }
        }

        stage('Build Backend (Spring Boot)') {
            steps {
                script {
                    echo 'Building backend application...'
                    dir('bookitout-back/bookitout') {
                        // Spring Boot 애플리케이션 빌드
                        sh './gradlew clean build'
                    }
                }
            }
        }

        stage('Build Frontend (React)') {
            steps {
                script {
                    echo 'Building frontend application...'
                    dir('bookitout-front') {
                        // 이전 빌드 파일 및 node_modules 정리
                        sh 'npx rimraf node_modules build'
                        // npm 의존성 설치
                        sh 'npm install'
                        // React 애플리케이션 빌드
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Flask (Python Crawler)') {
            steps {
                script {
                    echo 'Installing Flask app dependencies...'
                    dir('bookitout-flask/crawler') {
                        // Python 가상 환경 생성 및 활성화, 그리고 의존성 설치
                        sh '''
                            python3 -m venv venv
                            . venv/bin/activate
                            pip install -r requirements.txt
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images for all services...'

                    // 백엔드 Docker 이미지 빌드
                    dir('bookitout-back/bookitout') {
                        sh 'DOCKER_HOST=unix:///var/run/docker.sock docker build -t yuhyejin/bookitout-backend:latest .'
                    }
                    // 프론트엔드 Docker 이미지 빌드
                    dir('bookitout-front') {
                        sh 'DOCKER_HOST=unix:///var/run/docker.sock docker build -t yuhyejin/bookitout-frontend:latest .'
                    }
                    // Flask Docker 이미지 빌드
                    dir('bookitout-flask/crawler') {
                        sh 'DOCKER_HOST=unix:///var/run/docker.sock docker build -t yuhyejin/bookitout-flask-crawler:latest .'
                    }
                    echo 'All Docker images built successfully.'
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline finished."
            deleteDir()
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
