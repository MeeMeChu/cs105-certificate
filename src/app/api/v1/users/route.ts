import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET ALL USERS
export const GET = async (req: Request) => {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error with GET Users" },
      { status: 500 }
    );
  }
};

//create event
export const POST = async (req: Request) => {
  try {
    const { firstname, lastname, email, password, role } = await req.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const createUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role,
      },
    });
    return NextResponse.json({
      message: "User created successfully",
      data: createUser,
    });
  } catch (e) {
    console.error("Error creating user", e);
    return NextResponse.json(
      { message: "Internal Server Error with POST create event" },
      { status: 500 }
    );
  }
};
