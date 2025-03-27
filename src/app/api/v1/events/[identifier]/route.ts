import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//Get event by id
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ identifier: string }> }
) => {
  try {
    const { identifier } = await params; // รับค่า eventId

    // ลองค้นหาด้วย ID ก่อน
    let event = await prisma.event.findUnique({
      where: { id: identifier },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    // ถ้าไม่เจอ ID ให้ลองค้นหาด้วย slug
    if (!event) {
      event = await prisma.event.findUnique({
        where: { slug: identifier },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      });
    }

    if (!event) {
      return NextResponse.json({ message: "Event Not Found" }, { status: 404 });
    }

    const { _count, ...eventData } = event;
    return NextResponse.json(
      { ...eventData, count_total: _count.registrations },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching event :", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

//update event
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ identifier: string }> }
) => {
  try {
    const {
      title,
      slug,
      description,
      image,
      startDate,
      endDate,
      secretPass,
      status,
    } = await req.json();
    const { identifier } = await params;

    if (
      !title ||
      !slug ||
      !description ||
      !startDate ||
      !endDate ||
      !status ||
      !secretPass
    ) {
      return NextResponse.json(
        {
          messages: "title, description, date, secretPass, status is required",
        },
        { status: 400 }
      );
    }

    // ค้นหา event ด้วย id หรือ slug
    let event = await prisma.event.findUnique({
      where: { id: identifier },
    });

    if (!event) {
      event = await prisma.event.findUnique({
        where: { slug: identifier },
      });
    }

    if (!event) {
      return NextResponse.json({ message: "Event Not Found" }, { status: 404 });
    }

    const updateEvent = await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        title,
        slug,
        description,
        image,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        secretPass,
        status,
      },
    });
    return NextResponse.json(
      {
        message: "Event update successfully",
        data: updateEvent,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error updating event :", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ identifier : string }> }
) => {
  try {
    const { identifier  } = await params;
    // ค้นหา Event ว่ามีอยู่จริงไหม (เช็คทั้ง id และ slug)
    let event = await prisma.event.findUnique({
      where: { id: identifier },
    });

    if (!event) {
      event = await prisma.event.findUnique({
        where: { slug: identifier },
      });
    }

    // ถ้าไม่พบ Event
    if (!event) {
      return NextResponse.json({ message: "Event Not Found" }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id: event.id }, // ใช้ `id` ที่หาเจอ
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error delete event :", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
