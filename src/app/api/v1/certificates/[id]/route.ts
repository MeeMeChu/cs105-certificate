import { prisma } from "@lib/db";
import logger from "@lib/logger";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: {
        id,
      },
    });

    if (!certificate) {
      return NextResponse.json({ message: "Event Not Found" }, { status: 404 });
    }

    // Delete the certificate by ID
    await prisma.certificate.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Delete certificate successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ error }, "Error deleting certificate:");
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
