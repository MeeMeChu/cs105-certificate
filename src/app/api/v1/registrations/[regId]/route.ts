import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: Promise<{ regId: string }> }) => {
  try {
    const { regId } = await params;
    const registration = await prisma.registration.findUnique({
      where: { id: regId },
      include: { event: true },
    })

    if (!registration) {
      return NextResponse.json({ message: "Registration Not Found" }, { status: 404 });
    }

    return NextResponse.json({ ...registration }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ regId: string }> }
) => {
  try {
    const { regId } = await params;
    const { checkedIn, email, prefix, firstName, lastName, year, schoolName, registrationDate } = await req.json();

    const existingRegistration = await prisma.registration.findFirst({
      where: { id : regId },
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { message: "Registration not found" },
        { status: 404 }
      );
    }

    // อัปเดตข้อมูลใน database
    const updatedRegistration = await prisma.registration.update({
      where: { id : regId },
      data: {
        checkedIn,
        email,
        prefix,
        firstName,
        lastName,
        year,
        schoolName,
        registrationDate: new Date(registrationDate),
      },
    });

    return NextResponse.json({
      message: "Registration updated successfully",
      data: updatedRegistration,
    }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ regId: string }> }
) => {
  try {
    const { regId } = await params; // รับค่า registrationId จาก params

    // ค้นหาผู้เข้าร่วม (Registration) โดยใช้ id
    const registration = await prisma.registration.findUnique({
      where: { id : regId },
    });

    // ถ้าไม่พบผู้เข้าร่วม -> ส่ง 404
    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found" },
        { status: 404 }
      );
    }

    // ลบ Registration ที่ตรงกับ id ที่ส่งมา
    await prisma.registration.delete({
      where: { id: regId },
    });

    return NextResponse.json({ message: "Participant deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};