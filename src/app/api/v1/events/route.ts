import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const allEvent = await prisma.event.findMany();
    return NextResponse.json(allEvent, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error with GET all event" },
      { status: 500 }
    );
  }
};

//create event
export const POST = async (req: Request) => {
  try {
    const { id, slug, title, description, image, startDate, endDate, secretPass, location, status } =
      await req.json();

    if (!slug || !title || !description || !startDate || !endDate || !status || !secretPass) {
      return NextResponse.json(
        {
          messages: "title, description, date, status, secretPass is required",
        },
        { status: 400 }
      );
    }

    // เช็คว่า slug ซ้ำหรือไม่
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      return NextResponse.json(
        { message: "slug already exists" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        id,
        slug,
        title,
        description,
        image,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        secretPass,
        location,
        status,
      },
    });
    return NextResponse.json({
      message: "Event create successfully",
      data: newEvent,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error with POST create event" },
      { status: 500 }
    );
  }
};
