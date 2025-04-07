import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
