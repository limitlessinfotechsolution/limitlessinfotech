#!/bin/bash

# Limitless Infotech - Quick Deployment Script
# One-command deployment for production

set -e

echo "🚀 Quick Deploy - Limitless Infotech"
echo "===================================="

# Check if running on supported OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/ubuntu-release ] || [ -f /etc/debian_version ]; then
        echo "📦 Detected Ubuntu/Debian - Running installation..."
        bash scripts/install-ubuntu.sh
    elif [ -f /etc/redhat-release ] || [ -f /etc/centos-release ]; then
        echo "📦 Detected CentOS/RHEL - Running installation..."
        bash scripts/install-centos.sh
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📦 Detected macOS - Running installation..."
    bash scripts/install-macos.sh
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please run the appropriate installation script manually."
    exit 1
fi

# Set up project
echo "⚙️ Setting up project..."
bash scripts/setup-project.sh

# Start services
echo "🚀 Starting services..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed successfully!"
echo "===================================="
echo "🎉 Your Limitless Infotech system is now live!"
echo "Access your application at: http://localhost:3000"
echo ""
echo "🔧 Management commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View application logs"
echo "  pm2 restart all     - Restart application"
echo "  pm2 stop all        - Stop application"
