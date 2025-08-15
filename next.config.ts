import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable standalone output on Windows to avoid symlink issues
  ...(process.platform === 'win32' && { output: undefined }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/*",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
