import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET ALL USERS
export const GET = async (req: Request) => {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(
      users,
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error with GET Users" },
      { status: 500 }
    );
  }
}
