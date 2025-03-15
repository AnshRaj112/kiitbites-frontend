import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5001/api/:path*", // Your API endpoint
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
