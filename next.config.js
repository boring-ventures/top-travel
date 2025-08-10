/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Add your Supabase project domain
      "gjsxdqrdkhbyvcfjuxiq.supabase.co",
      "swfgvfhpmicwptupjyko.supabase.co",
      "xqakfzhkeiongvzgbhji.supabase.co",
      "images.unsplash.com",
    ],
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
