import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export const POST = async (req: Request) => {
  try {
    const { email, password, firstName, lastnName } = await req.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        firstname: firstName,
        lastname: lastnName,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        errorMessage: e,
      },
      { status: 500 }
    );
  }
}