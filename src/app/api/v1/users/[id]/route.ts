import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

//Get by id
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const userById = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userById) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ ...userById }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

//update by id
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { firstname, lastname, email, password, role } = await req.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const { id } = await params;
    if (!firstname && !lastname && !email && !password && !role) {
      return NextResponse.json(
        { message: "Firstname ,Lastname ,Email, Password, Role is required" },
        { status: 400 }
      );
    }
    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role,
      },
    });
    return NextResponse.json(
      { message: "Update user success" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error updating :", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 400 }
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
      await prisma.user.delete({
        where: { id: id },
      })
    );
  } catch (e) {
    console.error("Error delete user :", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};