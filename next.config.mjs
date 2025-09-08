/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Set to true if you are not using Next.js Image Optimization
  },
  // Add any other Next.js specific configurations here
  // For example, if you need to handle external packages for server components:
  // experimental: {
  //   serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  // },
  // If you need to configure headers for API routes:
  // async headers() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
  //         { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
  //       ],
  //     },
  //   ]
  // },
}

export default nextConfig
