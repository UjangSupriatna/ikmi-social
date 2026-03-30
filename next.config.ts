// Next.js configuration for IKMI SOCIAL
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for production deployment
  output: "standalone",
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // React configuration
  reactStrictMode: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
