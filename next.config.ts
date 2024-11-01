import type { Configuration } from "webpack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    // Existing webpack config if any
    if (isServer) {
      (config.externals as unknown[]).push({
        "chrome-aws-lambda": "chrome-aws-lambda",
      });
    }
    return config;
  },
};

export default nextConfig;
