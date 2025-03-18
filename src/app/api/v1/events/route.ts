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
    const { title, description, image, date, secretPass, status } =
      await req.json();

    if (!title && !description && !date && !status && !secretPass) {
      return NextResponse.json(
        {
          messages: "title, description, date, status, secretPass is required",
        },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        image,
        date,
        secretPass,
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
