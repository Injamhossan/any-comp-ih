import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false, // Security: Hide Next.js header
  productionBrowserSourceMaps: false, // Security: Do not expose source code in production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      }
    ],
  },
};

export default nextConfig;
