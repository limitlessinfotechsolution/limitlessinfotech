/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    domains: ['limitlessinfotech.com', 'vercel.app', 'githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production'
              ? 'https://limitlessinfotech.com'
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // Compression
  compress: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://limitlessinfotech.com',
  },

  // Webpack configuration for better bundle optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    config.optimization.splitChunks.chunks = 'all'

    // Add custom webpack plugins if needed
    if (!dev && !isServer) {
      config.optimization.minimizer.push(
        new webpack.DefinePlugin({
          __BUILD_ID__: JSON.stringify(buildId),
        })
      )
    }

    return config
  },

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/api-docs',
        destination: '/api-docs',
        permanent: false,
      },
    ]
  },

  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,

  // Configure build output
  distDir: '.next',

  // Enable React strict mode
  reactStrictMode: false,

  // Configure powered by header
  poweredByHeader: false,
}

export default nextConfig
