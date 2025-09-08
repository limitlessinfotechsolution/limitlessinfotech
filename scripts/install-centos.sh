#!/bin/bash

# Limitless Infotech - Complete CentOS/RHEL Installation Script
# This script installs ALL necessary dependencies and tools

set -e

echo "🚀 Starting Limitless Infotech Complete Installation (CentOS/RHEL)..."
echo "=================================================================="

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install EPEL repository
echo "📦 Installing EPEL repository..."
sudo yum install -y epel-release

# Install essential tools
echo "🔧 Installing essential tools..."
sudo yum install -y curl wget git unzip yum-utils device-mapper-persistent-data lvm2

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify Node.js and npm installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install global npm packages
echo "📦 Installing global npm packages..."
sudo npm install -g pm2 @supabase/cli vercel typescript ts-node

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
sudo yum install -y postgresql postgresql-server postgresql-contrib

# Initialize PostgreSQL
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
echo "🔴 Installing Redis..."
sudo yum install -y redis
sudo systemctl start redis
sudo systemctl enable redis

# Install Nginx
echo "🌐 Installing Nginx..."
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Docker
echo "🐳 Installing Docker..."
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Certbot
echo "🔒 Installing Certbot..."
sudo yum install -y certbot python3-certbot-nginx

# Install additional tools
echo "🛠️ Installing additional tools..."
sudo yum install -y htop tree nano vim curl wget zip unzip jq

# Configure firewall
echo "🔥 Configuring firewall..."
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload

echo "✅ CentOS/RHEL Installation completed successfully!"
