import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb',
    },
  },
};

export default nextConfig;
