"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createEvent(prevState: any ,formData: FormData) {
  try {
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();
    const image = formData.get("image")?.toString().trim();
    const startDate = formData.get("startDate")?.toString().trim() as string;
    const endDate = formData.get("endDate")?.toString().trim() as string;
    const location = formData.get("location")?.toString().trim();
    const status = formData.get("status")?.toString().trim();
    const secretPass = formData.get("secretPass")?.toString().trim();

    if (!title || !description || !slug || !startDate || !endDate || !location || !secretPass) {
      return { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }

    // เช็คว่า slug ซ้ำหรือไม่
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    // หาก slug ซ้ำ ส่งกลับข้อความผิดพลาด
    if (existingEvent) {
      return { success: false, message: "slug นี้ถูกใช้งานแล้ว" };
    }

    await prisma.event.create({
      data: {
        title,
        slug,
        description,
        image,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        secretPass,
        location,
        status,
      },
    });

    return { success: true, message: "เพิ่มกิจกรรมสำเร็จ!" };
  } catch (error) {
    return { success: false, message: "เกิดข้อผิดพลาดในการดำเนินการ" };
  }
}