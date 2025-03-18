import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

//create event 
export const POST = async (req: Request)=>{
    try{
        const { title, description, image, date, status } = await req.json();

        if (!title && !description && !date && !status) {
            return NextResponse.json(
                {messages : "title, description, date, status is required"},
                { status :400}
            );
        }
        
        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                image,
                date,
                status
            }
        })
        return NextResponse.json(newEvent)
    } catch (e) {
        console.error(e)
        return NextResponse.json(
            { message : "error when create event"},
            { status : 500})

    }
}