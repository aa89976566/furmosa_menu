import type { NextConfig } from "next";

const HAODADA_ORIGIN = "https://aa89976566.github.io/haodada";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async rewrites() {
    return [
      {
        source: "/haodada",
        destination: `${HAODADA_ORIGIN}/`,
      },
      {
        source: "/haodada/:path*",
        destination: `${HAODADA_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
