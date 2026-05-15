pipeline {

    agent any

    environment {
        IMAGE_NAME = "meetbikhani/jenkins_trial"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Skip Jenkins Auto Commit Build') {

            steps {

                script {

                    def commitAuthor = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()

                    echo "Last Commit Author: ${commitAuthor}"

                    if (commitAuthor == "jenkins@gmail.com") {

                        currentBuild.result = 'NOT_BUILT'

                        error("Build skipped because commit was pushed by Jenkins itself.")
                    }
                }
            }
        }

        stage('Install Dependencies') {

            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {

            steps {
                sh 'npm run test -- --run'
            }
        }

        stage('Increment Version') {

            steps {

                script {

                    def version = readFile('version.txt').trim()

                    def parts = version.tokenize('.')

                    def major = parts[0].toInteger()
                    def minor = parts[1].toInteger()
                    def patch = parts[2].toInteger()

                    patch++

                    def newVersion = "${major}.${minor}.${patch}"

                    writeFile file: 'version.txt', text: newVersion

                    env.APP_VERSION = newVersion

                    echo "New Version: ${newVersion}"
                }
            }
        }

        stage('Build Docker Image') {

            steps {

                sh """
                docker build \
                --no-cache \
                --provenance=false \
                -t $IMAGE_NAME:$APP_VERSION .
                """
            }
        }

        stage('Push Docker Image') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'docker_hub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    docker push $IMAGE_NAME:$APP_VERSION
                    '''
                }
            }
        }

        stage('Commit Version Update') {

            steps {

                sshagent(credentials: ['git']) {

                    sh '''
                        git checkout main

                        git config user.name "Jenkins CI"
                        git config user.email "jenkins@gmail.com"

                        git add version.txt

                        git commit -m "ci: bump version to ${APP_VERSION}" || echo "No changes to commit"

                        git push origin main
                    '''
                }
            }
        }
    }

    post {

        success {
            echo "Pipeline completed successfully."
        }

        failure {
            echo "Pipeline failed."
        }
    }
}
