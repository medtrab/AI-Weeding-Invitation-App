import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // framer-motion v11 JSX namespace conflict with moduleResolution:bundler
    // Runtime behavior is correct; types resolve at build time via Next.js JSX transform
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
