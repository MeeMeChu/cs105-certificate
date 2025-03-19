import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
   
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error " },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
    try{
      
        const { email,firstname,lastname } = await req.json()
    }catch(e){

    }
}