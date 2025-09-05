/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Add your Supabase project domain
      "gjsxdqrdkhbyvcfjuxiq.supabase.co",

      "images.unsplash.com",
      "images.pexels.com",
      "lh3.googleusercontent.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@prisma/client"],
};

module.exports = nextConfig;
