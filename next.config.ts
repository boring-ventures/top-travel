import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "gjsxdqrdkhbyvcfjuxiq.supabase.co",
      "images.unsplash.com",
      // Add randomuser.me for placeholder avatars
      "randomuser.me",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@prisma/client", "sharp"],
};

export default nextConfig;
