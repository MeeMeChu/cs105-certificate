import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ข้าม ESLint errors ในระหว่างการ build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ข้ามการตรวจสอบ TypeScript ในระหว่างการ build
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;