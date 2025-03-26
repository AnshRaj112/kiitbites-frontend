import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/team/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "development"
          ? "http://localhost:5001/api/:path*"
          : "https://your-production-backend.com/api/:path*", // Update for production
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false, // Strict TypeScript mode
  },
  experimental: {
    appDir: true, // Enable Next.js App Router (if applicable)
  },
};

export default nextConfig;
