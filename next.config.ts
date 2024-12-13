// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  },
  // Add this to temporarily bypass type checking during build if needed
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    // Add this to temporarily bypass ESLint during build if needed
    ignoreDuringBuilds: true
  },
  ignoreBuildErrors: true,
};

module.exports = nextConfig;