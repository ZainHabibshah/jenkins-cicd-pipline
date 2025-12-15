pipeline {
    agent any
    
    environment {
        AWS_REGION = 'Europe (Stockholm)'
        EC2_INSTANCE_ID = 'i-03a040198f8fca987'
        EC2_HOST = '13.61.182.30'
        APP_DIR = '/home/ubuntu/app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ZainHabibshah/jenkins-cicd-pipline'
                sh 'echo "Code checked out successfully"'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'echo "Dependencies installed"'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
                sh 'echo "Tests completed successfully"'
            }
        }
        
        stage('Build Package') {
            steps {
                // Create deployment package
                sh '''
                    tar -czf deployment.tar.gz \
                        app.js \
                        package.json \
                        package-lock.json \
                        node_modules/
                    echo "Package created: deployment.tar.gz"
                '''
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        # Copy files to EC2
                        scp -o StrictHostKeyChecking=no deployment.tar.gz ubuntu@${EC2_HOST}:${APP_DIR}/
                        
                        # SSH and deploy
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} "
                            cd ${APP_DIR}
                            
                            # Stop existing app
                            pm2 stop all 2>/dev/null || true
                            
                            # Extract new version
                            tar -xzf deployment.tar.gz
                            rm deployment.tar.gz
                            
                            # Install/update dependencies
                            npm install --production
                            
                            # Start application with PM2
                            pm2 start app.js --name 'cicd-demo' --update-env
                            pm2 save
                            
                            # Setup PM2 to start on boot
                            sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
                            
                            echo 'Deployment completed!'
                        "
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                sh """
                    sleep 5
                    curl -f http://${EC2_HOST}:3000 || exit 1
                    echo "Application is running successfully!"
                """
            }
        }
    }
}