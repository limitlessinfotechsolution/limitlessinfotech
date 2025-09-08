# Limitless Infotech Solutions Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

Welcome to the Limitless Infotech Solutions web application! This project serves as a comprehensive platform showcasing our services, projects, team, and providing a robust cPanel-like interface for managing web hosting aspects.

## 🚀 Project Overview

This application is built with Next.js (App Router), React, and Tailwind CSS, leveraging shadcn/ui components for a modern and responsive user interface. It includes:

-   **Marketing Pages**: Home, About Us, Services, Projects, Careers, Team, Contact Us.
-   **Documentation**: Company history, Mission & Values.
-   **Legal Pages**: Privacy Policy, Terms of Service, Cookies Policy.
-   **Admin Panel**: A secure area for internal management.
-   **cPanel-like Interface**: A custom control panel for managing hosting features like domains, databases, email accounts, files, SSL, CDN, security, and server monitoring.
-   **API Endpoints**: RESTful API routes for various functionalities, including authentication, contact forms, and cPanel operations.
-   **Real-time Features**: WebSocket integration for chat and notifications.
-   **File Management**: Cloud storage integration with Vercel Blob.
-   **Email Services**: Integration with Resend for transactional emails.

## ✨ Features

-   **Responsive Design**: Optimized for various screen sizes (desktop, tablet, mobile).
-   **Theming**: Dark and light mode support with next-themes.
-   **Form Handling**: Advanced form validation with react-hook-form and zod.
-   **Authentication**: NextAuth.js integration with multiple providers.
-   **Database**: Supabase integration for data persistence.
-   **Real-time Communication**: Socket.io for live chat and notifications.
-   **File Upload**: Secure file upload with cloud storage.
-   **Email Integration**: Automated email workflows with Resend.
-   **Security**: Comprehensive security headers and rate limiting.
-   **Performance**: Optimized with code splitting, lazy loading, and caching.
-   **Testing**: Jest and React Testing Library setup with coverage reporting.
-   **Monitoring**: Built-in health checks and error tracking.

## 🛠️ Tech Stack

-   **Framework**: Next.js 15+ with App Router
-   **Language**: TypeScript 5+
-   **Styling**: Tailwind CSS 3+ with custom design system
-   **UI Components**: shadcn/ui with Radix UI primitives
-   **State Management**: Zustand for client state
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: NextAuth.js
-   **Real-time**: Socket.io
-   **File Storage**: Vercel Blob
-   **Email**: Resend
-   **Deployment**: Docker + Docker Compose
-   **Monitoring**: Prometheus + Grafana (optional)

## 📋 Prerequisites

-   Node.js (v20 or higher)
-   pnpm (recommended) or npm/yarn
-   Docker & Docker Compose (for containerized deployment)
-   Git

## 🚀 Quick Start

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/limitlessinfotech/limitless-webapp.git
    cd limitless-webapp
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    ```bash
    cp .env.example .env.local
    # Edit .env.local with your configuration
    ```

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

    The application will be accessible at `http://localhost:3000`.

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run specific services
docker-compose up app postgres redis
```

## 🏗️ Building for Production

### Using Docker (Recommended)

```bash
# Build production image
docker build -t limitless-webapp:latest .

# Run with Docker Compose
docker-compose -f docker-compose.yml up -d
```

### Manual Build

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build the application
pnpm run build

# Start production server
pnpm run start
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure the following:

```env
# Application
NEXT_PUBLIC_APP_URL=https://limitlessinfotech.com
NEXT_PUBLIC_APP_NAME="Limitless Infotech Solutions"

# NextAuth.js
NEXTAUTH_URL=https://limitlessinfotech.com
NEXTAUTH_SECRET=your-nextauth-secret

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

### Database Setup

1. Create a Supabase project
2. Run the SQL migrations in `scripts/schema.sql`
3. Seed initial data with `scripts/seed.sql`

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run E2E tests
pnpm run test:e2e
```

## 📊 Monitoring

The application includes built-in monitoring:

- **Health Checks**: `/api/health` endpoint
- **Metrics**: Prometheus metrics (optional)
- **Logging**: Structured logging with Winston
- **Error Tracking**: Sentry integration (optional)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# With monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d
```

### Manual Deployment

```bash
# Build and start
pnpm run build
pnpm run start
```

## 📁 Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── api/                      # API routes
│   ├── components/               # Page-specific components
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   └── ...
├── lib/                          # Utility functions
│   ├── database.ts               # Database client
│   ├── auth.ts                   # Authentication helpers
│   └── ...
├── hooks/                        # Custom React hooks
├── styles/                       # Additional styles
├── public/                       # Static assets
├── scripts/                      # Build and deployment scripts
├── deployment/                   # Deployment configurations
├── monitoring/                   # Monitoring configurations
├── docs/                         # Documentation
└── tests/                        # Test files
```

## 🔒 Security

- **Authentication**: NextAuth.js with secure session management
- **Authorization**: Role-based access control
- **Security Headers**: Comprehensive security headers middleware
- **Rate Limiting**: API rate limiting with Upstash Redis
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in CSRF protection
- **HTTPS Only**: Enforced SSL/TLS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📝 Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript type checking

# Testing
pnpm run test         # Run unit tests
pnpm run test:watch   # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage

# Database
pnpm run db:generate  # Generate Prisma client
pnpm run db:migrate   # Run database migrations
pnpm run db:seed      # Seed database

# Deployment
pnpm run docker:build # Build Docker image
pnpm run docker:push  # Push Docker image
pnpm run deploy       # Deploy to production
```

## 📞 Support

- **Documentation**: [docs.limitlessinfotech.com](https://docs.limitlessinfotech.com)
- **Issues**: [GitHub Issues](https://github.com/limitlessinfotech/limitless-webapp/issues)
- **Email**: support@limitlessinfotech.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

Built with ❤️ by [Limitless Infotech Solutions](https://limitlessinfotech.com)
