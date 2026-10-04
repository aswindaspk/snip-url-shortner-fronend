import type { NextConfig } from "next";
const config: NextConfig = {
  agentRules: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/:path*`,
      },
    ];
  },
};
export default config;
