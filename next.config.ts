import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.1.13:3000",
    "192.168.1.13",
    "localhost",
  ],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://foody-backend-production.up.railway.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
