import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Token from middleware:", token); // ดูค่า Token

  // if (!token) {
  //   console.log("🚨 No token found, redirecting to /admin");
  //   return NextResponse.redirect(new URL("/admin", req.url));
  // }

  // if (token.role !== "admin") {
  //   console.log("🚨 Not an admin, redirecting to /");
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
