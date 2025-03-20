import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


//Get Information About Event :) ที่เลือกมา
export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params; // รับค่า eventId
  
      // ค้นหา Event และดึงข้อมูลผู้ลงทะเบียน
      const registrations = await prisma.registration.findMany({
        where: { eventId: id },
        include: { event: true }, // ดึงข้อมูล Event ด้วย
      });
  
      // ถ้าไม่มีใครลงทะเบียนเลย
      if (registrations.length === 0) {
        return NextResponse.json({ message: "No registrations found for this event" }, { status: 404 });
      }
  
      return NextResponse.json(registrations);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };

  
  export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const { email, firstName, lastName, year, schoolName, secretPass } = await req.json();
  
      // ตรวจสอบว่าอีเมล์ถูกต้องหรือไม่
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "กรุณากรอกอีเมล์ให้ถูกต้อง" }, { status: 400 });
      }
  
      // ค้นหาข้อมูล Event ตาม id
      const event = await prisma.event.findUnique({
        where: { id: id },
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
          eventId: id,
          email: email,
        },
      });
  
      if (existingRegistration) {
        return NextResponse.json({ error: "คุณเคยสมัครกิจกรรมนี้แล้ว" }, { status: 400 });
      }
  
      // สร้างการลงทะเบียนใหม่ในฐานข้อมูล
      const registration = await prisma.registration.create({
        data: {
          eventId: event.id,
          email,
          firstName,
          lastName,
          year,          
          schoolName     
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
  

  

  export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }>}) => {
    try {
      const { id } = await params; // รับค่า registrationId จาก params
  
      // ค้นหาผู้เข้าร่วม (Registration) โดยใช้ id
      const registration = await prisma.registration.findUnique({
        where: { id },
      });
  
      // ถ้าไม่พบผู้เข้าร่วม -> ส่ง 404
      if (!registration) {
        return NextResponse.json({ message: "Registration not found" }, { status: 404 });
      }
  
      // ลบ Registration ที่ตรงกับ id ที่ส่งมา
      await prisma.registration.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Participant deleted successfully" });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
  