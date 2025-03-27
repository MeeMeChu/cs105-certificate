import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//Get Information About Event :) ที่เลือกมา
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ identifier : string }> }
) => {
  try {
    const { identifier: eventId  } = await params; // รับค่า eventId

    // ค้นหา Event ด้วย id ก่อน ถ้าไม่เจอให้ใช้ slug
    let event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      event = await prisma.event.findUnique({
        where: { slug: eventId },
      });
    }

    // ถ้าไม่พบ Event
    if (!event) {
      return NextResponse.json({ message: "Event Not Found" }, { status: 404 });
    }

    // ค้นหา Event และดึงข้อมูลผู้ลงทะเบียน
    const registrations = await prisma.registration.findMany({
      where: { eventId: event.id },
      include: { event: true }, // ดึงข้อมูล Event ด้วย
    });

    // ถ้าไม่มีใครลงทะเบียนเลย
    if (registrations.length === 0) {
      return NextResponse.json(
        { message: "No registrations found for this event" },
        { status: 404 }
      );
    }

    return NextResponse.json(registrations, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ identifier: string }> }
) => {
  try {
    const { identifier: eventId } = await params;
    const { email, prefix, firstName, lastName, year, schoolName, secretPass } =
      await req.json();

    // ตรวจสอบว่าอีเมล์ถูกต้องหรือไม่
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมล์ให้ถูกต้อง" },
        { status: 400 }
      );
    }

    // ค้นหาข้อมูล Event ตาม id
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // ตรวจสอบว่า secretPass ตรงกับของกิจกรรมหรือไม่
    if (event.secretPass !== secretPass) {
      return NextResponse.json({ error: "รหัสเชิญชวนผิด" }, { status: 400 });
    }

    // เช็คว่าเคยลงทะเบียนกิจกรรมนี้ซ้ำมั้ย
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId: eventId,
        email: email,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "คุณเคยสมัครกิจกรรมนี้แล้ว" },
        { status: 400 }
      );
    }

    // สร้างการลงทะเบียนใหม่ในฐานข้อมูล
    const registration = await prisma.registration.create({
      data: {
        eventId: event.id,
        email,
        prefix,
        firstName,
        lastName,
        year,
        schoolName,
      },
    });

    return NextResponse.json({
      message: "Registration successful",
      registration,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
