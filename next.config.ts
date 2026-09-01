import type { NextConfig } from "next";

const HAODADA_ORIGIN = "https://aa89976566.github.io/haodada";
const CATNIP_HOST = "catnip-chick.furmosa.com";
const CATNIP_ORIGIN = "https://catnip-chick.vercel.app";

const catnipHost = {
  type: "host" as const,
  value: CATNIP_HOST,
};

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [catnipHost],
          destination: `${CATNIP_ORIGIN}/`,
        },
        {
          source: "/:path*",
          has: [catnipHost],
          destination: `${CATNIP_ORIGIN}/:path*`,
        },
      ],
      afterFiles: [
        {
          source: "/haodada",
          destination: `${HAODADA_ORIGIN}/`,
        },
        {
          source: "/haodada/:path*",
          destination: `${HAODADA_ORIGIN}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
