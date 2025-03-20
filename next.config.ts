import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ข้าม ESLint errors ในระหว่างการ build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ข้ามการตรวจสอบ TypeScript ในระหว่างการ build
  },
  // การตั้งค่าอื่น ๆ (ถ้ามี)
};

export default nextConfig;