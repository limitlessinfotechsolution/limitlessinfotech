#!/bin/bash

# Limitless Infotech - Project Setup Script
# This script sets up the project after system dependencies are installed

set -e

echo "🚀 Setting up Limitless Infotech Project..."
echo "==========================================="

# Create project directory
PROJECT_DIR="/var/www/limitless"
echo "📁 Creating project directory at $PROJECT_DIR..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# Navigate to project directory
cd $PROJECT_DIR

# Initialize project if package.json doesn't exist
if [ ! -f "package.json" ]; then
    echo "📦 Initializing new project..."
    npm init -y
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Install development dependencies
echo "📦 Installing development dependencies..."
npm install --save-dev @types/node @types/react @types/react-dom typescript eslint prettier

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p {app,components,lib,hooks,types,scripts,deployment,public}

# Set up environment file
echo "⚙️ Setting up environment configuration..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please configure your environment variables in .env.local"
fi

# Set up database
echo "🗄️ Setting up database..."
if command -v psql &> /dev/null; then
    echo "Creating database user and database..."
    sudo -u postgres psql -c "CREATE USER limitless_user WITH PASSWORD 'your_password_here';" || true
    sudo -u postgres psql -c "CREATE DATABASE limitless_production OWNER limitless_user;" || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE limitless_production TO limitless_user;" || true
    
    # Run database schema
    if [ -f "scripts/database-schema.sql" ]; then
        echo "Running database schema..."
        PGPASSWORD=your_password_here psql -h localhost -U limitless_user -d limitless_production -f scripts/database-schema.sql
    fi
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Set up PM2 ecosystem file
echo "⚙️ Setting up PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'limitless-infotech',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Set up Nginx configuration
echo "🌐 Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/limitless << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/limitless /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Project setup completed successfully!"
echo "======================================="
echo "🎉 Next steps:"
echo "1. Configure environment variables in .env.local"
echo "2. Update database connection settings"
echo "3. Replace 'your-domain.com' in Nginx config with your actual domain"
echo "4. Run: pm2 start ecosystem.config.js"
echo "5. Set up SSL with: sudo certbot --nginx -d your-domain.com"
echo ""
echo "🚀 Your Limitless Infotech system is ready to go live!"
