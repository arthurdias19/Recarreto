
pipeline {
    agent any

    environment {
        PATH = "/home/arthurdias/.nvm/versions/node/v22.23.4/bin:${env.PATH}"
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Verificar configuracao') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'EXPO_TOKEN',
                        variable: 'EXPO_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "=== Node.js ==="
                        node --version

                        echo "=== NPM ==="
                        npm --version

                        echo "=== EAS CLI ==="
                        eas --version

                        echo "=== Autenticacao Expo ==="
                        eas whoami

                        echo "=== Projeto Expo ==="
                        eas project:info
                    '''
                }
            }
        }

        stage('Build e envio para Google Play') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'EXPO_TOKEN',
                        variable: 'EXPO_TOKEN'
                    )
                ]) {
                    sh '''
                        eas build \
                            --platform android \
                            --profile production \
                            --auto-submit \
                            --non-interactive
                    '''
                }
            }
        }
    }
}
