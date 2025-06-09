import { prisma } from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [signatures, total] = await Promise.all([
      prisma.signature.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.signature.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        data: signatures,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { firstName, lastName, path } = await req.json();

    if (!firstName || !lastName || !path) {
      return NextResponse.json(
        { message: "firstName, lastName, and path are required" },
        { status: 400 }
      );
    }

    const newSignature = await prisma.signature.create({
      data: {
        firstName,
        lastName,
        path,
      },
    });

    return NextResponse.json(
      { message: "Signature created successfully", data: newSignature },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}