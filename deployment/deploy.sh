#!/bin/bash

# This script automates the deployment of the Next.js application.
# It assumes you have SSH access to your server and Docker/Nginx set up.

# Configuration variables
SERVER_USER="your_ssh_user"
SERVER_HOST="your_server_ip_or_domain"
DEPLOY_PATH="/var/www/limitless-webapp" # Path on your server where the app will be deployed
NGINX_CONFIG_PATH="/etc/nginx/sites-available/limitless-webapp.conf" # Nginx config path on server
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/limitless-webapp.conf" # Nginx enabled path on server
DOCKER_COMPOSE_PATH="$DEPLOY_PATH/docker-compose.yml" # Docker Compose file path on server
APP_NAME="limitless-webapp" # Name for your Docker containers/images

# --- Pre-deployment Checks ---
echo "--- Starting Deployment ---"
echo "Checking prerequisites..."

# Check if SSH key is loaded (optional, but good practice)
if ! ssh-add -l &>/dev/null; then
    echo "Warning: No SSH keys loaded. Ensure you can SSH into $SERVER_USER@$SERVER_HOST without a password, or you will be prompted."
fi

# Check if Docker is installed locally (for building image)
if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed. Please install Docker to build the image."
    exit 1
fi

# Check if SSH is available
if ! command -v ssh &> /dev/null
then
    echo "Error: SSH client is not installed. Please install OpenSSH client."
    exit 1
fi

# --- Build Docker Image ---
echo "--- Building Docker image locally ---"
docker build -t $APP_NAME .

if [ $? -ne 0 ]; then
    echo "Error: Docker image build failed."
    exit 1
fi
echo "Docker image built successfully: $APP_NAME"

# --- Transfer Files to Server ---
echo "--- Transferring application files to $SERVER_HOST:$DEPLOY_PATH ---"

# Create deployment directory on server if it doesn't exist
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $DEPLOY_PATH"

# Use rsync for efficient file transfer (only transfers changed files)
# Exclude node_modules and .next as they are handled by Docker build
rsync -avz --delete \
    --exclude 'node_modules/' \
    --exclude '.next/' \
    --exclude '.git/' \
    --exclude '.env*' \
    --exclude 'dist/' \
    --exclude 'build/' \
    --exclude 'coverage/' \
    ./ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/

if [ $? -ne 0 ]; then
    echo "Error: File transfer failed."
    exit 1
fi
echo "Files transferred successfully."

# --- Deploy on Server using Docker Compose ---
echo "--- Deploying application on $SERVER_HOST using Docker Compose ---"

# Copy Docker Compose file to the server
scp docker-compose.yml $SERVER_USER@$SERVER_HOST:$DOCKER_COMPOSE_PATH

# Copy Nginx production config to the server
scp deployment/nginx-production.conf $SERVER_USER@$SERVER_HOST:$NGINX_CONFIG_PATH

# SSH into the server and perform Docker operations
ssh $SERVER_USER@$SERVER_HOST << EOF
    echo "Navigating to deployment path: $DEPLOY_PATH"
    cd $DEPLOY_PATH

    echo "Logging in to local Docker registry (if applicable)..."
    # If you use a private registry, add docker login command here
    # docker login your-registry.com

    echo "Loading Docker image from local build into server's Docker daemon..."
    # Save the image locally and then load it on the server
    # This is an alternative to pushing to a registry if you don't have one
    # docker save $APP_NAME | ssh $SERVER_USER@$SERVER_HOST docker load

    # For simplicity, assuming the image is built on the server or pulled from a public registry
    # If you built locally and want to transfer, uncomment the docker save/load above
    # Or, if you have a private registry, push the image: docker push your-registry.com/$APP_NAME

    echo "Pulling latest Docker image (if using a registry)..."
    # docker pull $APP_NAME # Uncomment if pulling from a registry

    echo "Stopping and removing existing containers..."
    docker compose -f docker-compose.yml down --remove-orphans

    echo "Starting new containers with Docker Compose..."
    docker compose -f docker-compose.yml up -d --build

    if [ \$? -ne 0 ]; then
        echo "Error: Docker Compose failed to start containers."
        exit 1
    fi
    echo "Docker containers started successfully."

    echo "Configuring Nginx..."
    # Create a symlink to enable the Nginx config
    sudo ln -sf $NGINX_CONFIG_PATH $NGINX_ENABLED_PATH

    # Test Nginx configuration
    sudo nginx -t

    if [ \$? -ne 0 ]; then
        echo "Error: Nginx configuration test failed. Check $NGINX_CONFIG_PATH"
        exit 1
    fi

    # Reload Nginx to apply new configuration
    sudo systemctl reload nginx

    if [ \$? -ne 0 ]; then
        echo "Error: Failed to reload Nginx. Check Nginx service status."
        exit 1
    fi
    echo "Nginx reloaded successfully."

    echo "Cleaning up old Docker images (optional)..."
    docker image prune -f

EOF

if [ $? -ne 0 ]; then
    echo "Error: SSH command execution failed on server."
    exit 1
fi

echo "--- Deployment Complete! ---"
echo "Your application should now be running at your server's IP/domain."
echo "Remember to update your DNS records to point to your server if you haven't already."
