#!/bin/bash

# Limitless Infotech - Complete macOS Installation Script
# This script installs ALL necessary dependencies and tools

set -e

echo "🚀 Starting Limitless Infotech Complete Installation (macOS)..."
echo "============================================================="

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Update Homebrew
echo "📦 Updating Homebrew..."
brew update

# Install Node.js
echo "📦 Installing Node.js..."
brew install node@18
brew link node@18

# Verify Node.js and npm installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install global npm packages
echo "📦 Installing global npm packages..."
npm install -g pm2 @supabase/cli vercel typescript ts-node

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
brew install postgresql@14
brew services start postgresql@14

# Install Redis
echo "🔴 Installing Redis..."
brew install redis
brew services start redis

# Install Nginx
echo "🌐 Installing Nginx..."
brew install nginx
brew services start nginx

# Install Docker
echo "🐳 Installing Docker..."
brew install --cask docker

# Install additional tools
echo "🛠️ Installing additional tools..."
brew install htop tree jq wget curl

echo "✅ macOS Installation completed successfully!"
echo "============================================="
echo "🎉 All dependencies installed:"
echo "   ✅ Node.js $(node --version)"
echo "   ✅ npm $(npm --version)"
echo "   ✅ PostgreSQL $(postgres --version 2>/dev/null || echo 'Installed')"
echo "   ✅ Redis $(redis-server --version)"
echo "   ✅ Nginx $(nginx -v 2>&1)"
echo "   ✅ Docker (Please start Docker Desktop)"
echo ""
echo "🚀 Ready to deploy Limitless Infotech!"
