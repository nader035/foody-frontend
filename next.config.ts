import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["localhost:3000", "192.168.1.13:3000", "192.168.1.13", "localhost"],
};

export default nextConfig;
