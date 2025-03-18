import { Message } from "@mui/icons-material";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//Get event by id
export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // if(!params.id) {
    //     return NextResponse.json(
    //         {message:"Event ID is required"},
    //         {status:400},
    //     )
    // }

    const eventById = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!eventById) {
      return NextResponse.json({ Message: "Event Not Found" }, { status: 404 });
    }
    return NextResponse.json(eventById, { status: 200 });
  } catch (e) {
    console.error("Error fetching event :", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { title, description, image, date, secretPass, status } =
      await req.json();
    if (!title && !description && !date && !status && !secretPass) {
      return NextResponse.json(
        {
          messages: "title, description, date, secretPass, status is required",
        },
        { status: 400 }
      );
    }
    const updateEvent = await prisma.event.update({
      where: {
        id: params.id,
      },
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
      message: "Event update successfully",
      data: updateEvent,
    });
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
  { params }: { params: { id: string } }
) => {
  try {
    return NextResponse.json(
      await prisma.event.delete({
        where: { id: params.id },
      })
    );
  } catch (e) {
    console.error("Error delete event :", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
