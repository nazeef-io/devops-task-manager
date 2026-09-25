 pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }


    stage('Build Frontend Image') {
        steps {
            echo 'Building frontend Docker image...'
            sh 'docker build --build-arg VITE_API_BASE_URL=http://192.168.56.101:5000/api -t task-frontend:${BUILD_NUMBER} ./frontend'
        }
    }
                              
    stage('Scan Frontend Image') {
    	steps {
    	    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            sh '''
            	    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 task-frontend:${BUILD_NUMBER}
        	    '''
        }
    }
}

        stage('Push Frontend Image') {
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


        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image...'
                sh 'docker build -t task-backend:${BUILD_NUMBER} ./backend'
            }
        }

        stage('Scan Image') {
            steps {
                     echo 'Scanning Docker image for vulnerabilities...'
                     sh '''
                           docker run --rm \
                           -v /var/run/docker.sock:/var/run/docker.sock \
                           -v $(pwd)/backend/.trivyignore:/.trivyignore \
                           aquasec/trivy image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 --ignorefile /.trivyignore task-backend:${BUILD_NUMBER}
                       '''
              }
            }


        stage('Push to Registry') {
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

 }

