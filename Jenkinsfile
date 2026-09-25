pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        // ---------------- FRONTEND ----------------

        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend Docker image...'
                sh 'docker build --build-arg VITE_API_BASE_URL=http://192.168.56.101:5000/api -t task-frontend:${BUILD_NUMBER} ./frontend'
            }
        }

        stage('Scan Frontend Image') {
            steps {
                script {
                    env.FRONTEND_SCAN_PASSED = 'false'
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        sh '''
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                aquasec/trivy image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 task-frontend:${BUILD_NUMBER}
                        '''
                        env.FRONTEND_SCAN_PASSED = 'true'
                    }
                }
            }
        }

        stage('Push Frontend Image') {
            when {
                environment name: 'FRONTEND_SCAN_PASSED', value: 'true'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '0b16352d-915d-4664-8b36-24416c33e4ef',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag task-frontend:${BUILD_NUMBER} $DOCKER_USER/task-frontend:${BUILD_NUMBER}
                        docker push $DOCKER_USER/task-frontend:${BUILD_NUMBER}
                    '''
                }
            }
        }

        // ---------------- BACKEND ----------------

        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image...'
                sh 'docker build -t task-backend:${BUILD_NUMBER} ./backend'
            }
        }

        stage('Scan Backend Image') {
            steps {
                script {
                    env.BACKEND_SCAN_PASSED = 'false'
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        sh '''
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                -v $(pwd)/backend/.trivyignore:/.trivyignore \
                                aquasec/trivy image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 --ignorefile /.trivyignore task-backend:${BUILD_NUMBER}
                        '''
                        env.BACKEND_SCAN_PASSED = 'true'
                    }
                }
            }
        }

        stage('Push Backend Image') {
            when {
                environment name: 'BACKEND_SCAN_PASSED', value: 'true'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '0b16352d-915d-4664-8b36-24416c33e4ef',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag task-backend:${BUILD_NUMBER} $DOCKER_USER/task-backend:${BUILD_NUMBER}
                        docker push $DOCKER_USER/task-backend:${BUILD_NUMBER}
                    '''
                }
            }
        }

    }

    post {
        always {
            echo "Frontend scan passed: ${env.FRONTEND_SCAN_PASSED}"
            echo "Backend scan passed: ${env.BACKEND_SCAN_PASSED}"
        }
    }
}
