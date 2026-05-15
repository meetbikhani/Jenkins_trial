pipeline {
    agent any

    environment {
        IMAGE_NAME = "meetbikhani/jenkins_trial"
    }

    stages {

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

                sshagent(credentials: ['github-ssh']) {

                    sh """

                    git config user.name "Jenkins CI"
                    git config user.email "jenkins@gmail.com"

                    git add version.txt

                    git commit -m "ci: bump version to $APP_VERSION"

                    git push origin main
                    """
                }
            }
        }
    }
}
