import { prisma } from "@lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    // Find the signature first
    const signature = await prisma.signature.findUnique({
      where: { id },
    });

    if (!signature) {
      return NextResponse.json(
        { message: "Signature not found" },
        { status: 404 }
      );
    }

    // Delete the physical file if it exists
    if (signature.path) {
      const filePath = path.join(
        process.cwd(),
        "public",
        signature.path
      );
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.log("File not found or already deleted:", signature.path);
      }
    }

    // Delete from database
    await prisma.signature.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Signature deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Delete error:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
