# Limitless Infotech - Complete Windows Installation Script
# This script installs ALL necessary dependencies and tools

Write-Host "🚀 Starting Limitless Infotech Complete Installation (Windows)..." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Install Chocolatey if not installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install Node.js
Write-Host "📦 Installing Node.js..." -ForegroundColor Yellow
choco install nodejs --version=18.17.0 -y

# Install Git
Write-Host "📦 Installing Git..." -ForegroundColor Yellow
choco install git -y

# Install PostgreSQL
Write-Host "🗄️ Installing PostgreSQL..." -ForegroundColor Yellow
choco install postgresql14 --params '/Password:postgres123' -y

# Install Redis
Write-Host "🔴 Installing Redis..." -ForegroundColor Yellow
choco install redis-64 -y

# Install Docker Desktop
Write-Host "🐳 Installing Docker Desktop..." -ForegroundColor Yellow
choco install docker-desktop -y

# Install additional tools
Write-Host "🛠️ Installing additional tools..." -ForegroundColor Yellow
choco install vscode -y
choco install postman -y
choco install 7zip -y

# Refresh environment variables
Write-Host "🔄 Refreshing environment variables..." -ForegroundColor Yellow
refreshenv

# Install global npm packages
Write-Host "📦 Installing global npm packages..." -ForegroundColor Yellow
npm install -g pm2 @supabase/cli vercel typescript ts-node

Write-Host "✅ Windows Installation completed successfully!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "🎉 All dependencies installed!" -ForegroundColor Green
Write-Host "   ✅ Node.js" -ForegroundColor Green
Write-Host "   ✅ npm" -ForegroundColor Green
Write-Host "   ✅ PostgreSQL" -ForegroundColor Green
Write-Host "   ✅ Redis" -ForegroundColor Green
Write-Host "   ✅ Docker Desktop" -ForegroundColor Green
Write-Host "   ✅ Git" -ForegroundColor Green
Write-Host "" 
Write-Host "🚀 Ready to deploy Limitless Infotech!" -ForegroundColor Green
Write-Host "Please restart your computer to complete the installation." -ForegroundColor Yellow
