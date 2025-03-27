import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//Get event by id
export const GET = async (
  req: Request,
  { params }:  { params: Promise<{ id: string }> } 
) => {
  try {
    const { id } = await params; // รับค่า eventId
    // if(!params.id) {
    //     return NextResponse.json(
    //         {message:"Event ID is required"},
    //         {status:400},
    //     )
    // }

    const eventById = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    
    const count_total = await prisma.registration.count({
      where : {
        eventId : id
      }
    })

    if (!eventById) {
      return NextResponse.json({ Message: "Event Not Found" }, { status: 404 });
    }
    return NextResponse.json({ ...eventById ,count_total } , { status: 200 });
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
  { params }: { params: Promise<{ id: string }>}
) => {
  try {
    const { title, slug ,description, image, startDate, endDate, secretPass, status } =
      await req.json();
    const { id }= await params

    if (!title || !slug || !description || !startDate || !endDate || !status || !secretPass) {
      return NextResponse.json(
        {
          messages: "title, description, date, secretPass, status is required",
        },
        { status: 400 }
      );
    }
    const updateEvent = await prisma.event.update({
      where: {
        id: id,
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
  { params }:  { params: Promise<{ id: string }>} 
) => {
  try {
    const { id } = await params
    return NextResponse.json(
      await prisma.event.delete({
        where: { id: id },
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
