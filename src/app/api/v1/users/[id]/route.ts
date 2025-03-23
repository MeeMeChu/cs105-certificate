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
    const { id } = await params;
    const { firstName, lastName, email, password, role } = await req.json();
    
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { message: "firstName, lastName, email, role is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id: id } });
    if (!existingUser) {
      return NextResponse.json({  message: "User not found." }, { status: 404 });
    }

    // อัปเดตเฉพาะฟิลด์ที่ส่งมา
    const updateData: any = {
      firstName,
      lastName,
      email,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "User updated successfully." },
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
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
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
