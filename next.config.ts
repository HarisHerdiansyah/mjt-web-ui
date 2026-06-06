import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://139.59.249.159:8000/api/:path*",
      },
    ];
  },
};
export default nextConfig;
