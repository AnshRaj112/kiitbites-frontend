import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kiitbites-backend.onrender.com",
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
          : "https://kiitbites-backend.onrender.com/api/:path*", // Production API
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false, // Strict TypeScript mode
  },
};

export default nextConfig;
