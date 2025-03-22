import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: string; // ✅ เพิ่ม role เข้าไป
  }

  interface Session {
    user: User; // ✅ ให้ Session มี Role
  }
}