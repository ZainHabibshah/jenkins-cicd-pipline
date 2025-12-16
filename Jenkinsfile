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
            sh '''
                # Test connection first
                ssh -o StrictHostKeyChecking=no ubuntu@'${EC2_HOST}' "echo 'SSH connection successful'"
                
                # Copy files
                scp -o StrictHostKeyChecking=no deployment.tar.gz ubuntu@'${EC2_HOST}':'${APP_DIR}'/
                
                # Deploy using a script
                ssh -o StrictHostKeyChecking=no ubuntu@'${EC2_HOST}' '
                    cd '${APP_DIR}'
                    
                    # Stop existing app
                    pm2 stop all 2>/dev/null || true
                    
                    # Backup existing files if needed
                    if [ -d current ]; then
                        mv current backup_$(date +%Y%m%d_%H%M%S)
                    fi
                    
                    # Extract new version
                    tar -xzf deployment.tar.gz -C .
                    rm deployment.tar.gz
                    
                    # Install dependencies
                    npm install --production
                    
                    # Start application
                    pm2 start app.js --name "cicd-demo" --update-env
                    pm2 save
                    
                    # Only run startup once (comment out after first run)
                    # pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true
                    
                    echo "Deployment completed successfully!"
                '
            '''
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