import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hide the "N" dev-tools badge; compile and runtime errors still show.
  devIndicators: false,
};

export default nextConfig;
