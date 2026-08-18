import type { NextConfig } from "next";

const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: "standalone" }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["preview-chat-aa6c6859-e9a5-457a-816f-dbbcff2f17a0.space-z.ai", "preview-chat-351046d6-1200-480f-b6cf-40c9a8a04d5.space-z.ai"],
  images: {
    // Use unoptimized on Vercel free tier to save image optimization quota
    // Cloudflare CDN will handle caching instead
    unoptimized: !!process.env.VERCEL,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
