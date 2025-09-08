# Limitless Infotech Solutions Web Application

Welcome to the Limitless Infotech Solutions web application! This project serves as a comprehensive platform showcasing our services, projects, team, and providing a robust cPanel-like interface for managing web hosting aspects.

## Project Overview

This application is built with Next.js (App Router), React, and Tailwind CSS, leveraging shadcn/ui components for a modern and responsive user interface. It includes:

-   **Marketing Pages**: Home, About Us, Services, Projects, Careers, Team, Contact Us.
-   **Documentation**: Company history, Mission & Values.
-   **Legal Pages**: Privacy Policy, Terms of Service, Cookies Policy.
-   **Admin Panel**: A secure area for internal management.
-   **cPanel-like Interface**: A custom control panel for managing hosting features like domains, databases, email accounts, files, SSL, CDN, security, and server monitoring.
-   **API Endpoints**: Mock API routes for various functionalities, including authentication, contact forms, and cPanel operations.

## Features

-   **Responsive Design**: Optimized for various screen sizes (desktop, tablet, mobile).
-   **Theming**: Dark and light mode support.
-   **Form Handling**: Contact forms with mock backend logic.
-   **Dynamic Content**: Project and service detail pages.
-   **Interactive cPanel**: Simulate management of web hosting resources.
-   **Authentication**: Mock authentication routes for login, logout, password reset.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   Yarn (recommended) or npm

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/your-username/limitless-webapp.git
    cd limitless-webapp
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    yarn install
    # or npm install
    \`\`\`

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your environment variables. For this project, mock APIs are used, so no external API keys are strictly required for basic functionality, but you can add placeholders if needed.

    \`\`\`env
    # Example (if you were to integrate real services)
    # NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
    # JWT_SECRET=your_jwt_secret_key
    # RESEND_API_KEY=your_resend_api_key
    \`\`\`

4.  **Run the development server:**
    \`\`\`bash
    yarn dev
    # or npm run dev
    \`\`\`

    The application will be accessible at `http://localhost:3000`.

### Building for Production

\`\`\`bash
yarn build
# or npm run build
\`\`\`

### Running in Production Mode

\`\`\`bash
yarn start
# or npm start
\`\`\`

## Project Structure

\`\`\`
.
├── app/
│   ├── api/                  # Next.js API Routes (mock backend)
│   │   ├── approvals/
│   │   ├── auth/
│   │   ├── cpanel/           # cPanel specific API routes
│   │   ├── contact/
│   │   ├── currency/
│   │   ├── health/
│   │   ├── projects/
│   │   ├── receive-emails/
│   │   ├── send-email/
│   │   ├── tasks/
│   │   ├── upload/
│   │   └── users/
│   ├── cpanel/               # cPanel UI components and pages
│   │   ├── components/
│   │   └── page.tsx
│   ├── components/           # Application-specific React components
│   ├── docs/                 # Documentation pages
│   ├── services/             # Service detail pages
│   ├── about/
│   ├── admin/
│   ├── api-docs/
│   ├── careers/
│   ├── contact/
│   ├── cookies/
│   ├── demo/
│   ├── employee/
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Loading states for routes
│   ├── not-found.tsx         # Custom 404 page
│   ├── page.tsx              # Home page
│   ├── privacy/
│   ├── projects/
│   ├── robots.ts             # robots.txt generation
│   ├── sitemap.ts            # sitemap.xml generation
│   ├── team/
│   ├── terms/
│   └── webmail/
├── components/               # Shared UI components (shadcn/ui overrides/extensions)
│   ├── ui/                   # shadcn/ui components
│   ├── contact-form.tsx
│   ├── currency-provider.tsx
│   ├── error-boundary.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── deployment/               # Deployment scripts and configurations
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and libraries
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── currency.ts
│   ├── database.ts
│   ├── email.ts
│   ├── rate-limit.ts
│   ├── utils.ts
│   └── validation.ts
├── public/                   # Static assets (images, fonts, etc.)
│   ├── images/
│   └── ...
├── scripts/                  # Utility scripts (e.g., database setup, testing)
├── styles/                   # Global CSS
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── yarn.lock                 # Yarn lock file
\`\`\`

## Technologies Used

-   **Next.js 14+**: React framework for production.
-   **React 18+**: JavaScript library for building user interfaces.
-   **TypeScript**: Strongly typed JavaScript.
-   **Tailwind CSS**: A utility-first CSS framework.
-   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
-   **Lucide React**: Beautifully crafted open-source icons.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is open-source and available under the [MIT License](LICENSE).
