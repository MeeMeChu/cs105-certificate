import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@type/user";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("🚀 ~ middleware ~ token:", token);
  const url = req.nextUrl.pathname;

  // ถ้าอยู่ที่หน้า /admin (หน้า login) ให้ผ่านไปได้เลย
  if (url === "/admin") {
    return NextResponse.next();
  }

  // ถ้าไม่มี token ให้ redirect ไปหน้า login (/admin)
  if (!token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // เช็ค Token หมดอายุหรือไม่
  if (token.exp) {
    const expirationTime = Number(token.exp) * 1000;
    if (expirationTime < Date.now()) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  } else {
    // หากไม่มี exp ให้ถือว่า token หมดอายุหรือไม่ถูกต้อง
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // เช็ค role
  if (token.role !== Role.admin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
