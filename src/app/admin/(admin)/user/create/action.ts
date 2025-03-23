"use server";

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(prevState: any ,formData: FormData) {
  try {
    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const role = formData.get("role")?.toString().trim();

    // ตรวจสอบค่าที่รับมา (ห้ามเป็นค่าว่าง)
    if (!firstName || !lastName || !email || !password || !role) {
      return { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }

    // ตรวจสอบอีเมลซ้ำ
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Email is already registered." };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้างผู้ใช้ใหม่
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });
    
    return { success: true, message: "User created successfully." };
  } catch (e) {
    return { success: false, message: "Internal server error." };
  }
}