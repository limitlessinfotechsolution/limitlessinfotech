#!/bin/bash

# Limitless Infotech - Complete Ubuntu/Debian Installation Script
# This script installs ALL necessary dependencies and tools

set -e

echo "🚀 Starting Limitless Infotech Complete Installation..."
echo "=================================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x (LTS)
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js and npm installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install global npm packages
echo "📦 Installing global npm packages..."
sudo npm install -g pm2 @supabase/cli vercel typescript ts-node

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib postgresql-client

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
echo "🔴 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Certbot for SSL
echo "🔒 Installing Certbot for SSL certificates..."
sudo apt install -y certbot python3-certbot-nginx

# Install additional tools
echo "🛠️ Installing additional development tools..."
sudo apt install -y htop tree nano vim curl wget zip unzip jq

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/limitless
sudo chown -R $USER:$USER /var/www/limitless

# Install project dependencies
echo "📦 Installing project dependencies..."
cd /var/www/limitless
npm install

# Set up PostgreSQL database
echo "🗄️ Setting up PostgreSQL database..."
sudo -u postgres createuser --interactive --pwprompt limitless_user
sudo -u postgres createdb -O limitless_user limitless_production

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000
sudo ufw allow 5432
sudo ufw --force enable

echo "✅ Installation completed successfully!"
echo "=================================================="
echo "🎉 All dependencies installed:"
echo "   ✅ Node.js $(node --version)"
echo "   ✅ npm $(npm --version)"
echo "   ✅ PostgreSQL $(psql --version | head -n1)"
echo "   ✅ Redis $(redis-server --version)"
echo "   ✅ Nginx $(nginx -v 2>&1)"
echo "   ✅ Docker $(docker --version)"
echo "   ✅ Docker Compose $(docker-compose --version)"
echo "   ✅ PM2 $(pm2 --version)"
echo "   ✅ Certbot $(certbot --version)"
echo ""
echo "🚀 Ready to deploy Limitless Infotech!"
echo "Next steps:"
echo "1. Configure environment variables"
echo "2. Run database migrations"
echo "3. Deploy the application"
