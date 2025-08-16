import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.platform === "win32" && { output: undefined }),
  images: {
    domains: [
      // Add your Supabase project domain
      "swfgvfhpmicwptupjyko.supabase.co",
      "xqakfzhkeiongvzgbhji.supabase.co",
      "erbemjrbtyxryzdiqtnl.supabase.co",
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
};

export default nextConfig;
