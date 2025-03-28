import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const { id, eventId, email, prefix, firstName, lastName, year, schoolName, checkedIn, registrationDate } = 
      await req.json();

    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบหรือไม่
    if (!id || !eventId || !email || !firstName || !lastName || !year || !schoolName || !registrationDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ตรวจสอบว่า Event มีอยู่จริงหรือไม่
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // ตรวจสอบว่ามีอีเมลนี้ลงทะเบียนกับอีเวนต์นี้ไปแล้วหรือไม่
    const existingRegistration = await prisma.registration.findFirst({
      where: { eventId, email },
    });

    if (existingRegistration) {
      return NextResponse.json({ message: "This email is already registered" }, { status: 400 });
    }

    // สร้างข้อมูลการลงทะเบียนใหม่
    const newRegistration = await prisma.registration.create({
      data: {
        id,
        eventId,
        email,
        prefix,
        firstName,
        lastName,
        year,
        schoolName,
        checkedIn: checkedIn ?? false, // ค่าเริ่มต้นเป็น false ถ้าไม่ได้ส่งมา
        registrationDate: new Date(registrationDate), // ใช้ค่าจาก request หรือแปลงเป็น Date
      },
    });

    return NextResponse.json({ message: "Registration successful", data: newRegistration }, { status: 201 });

  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};