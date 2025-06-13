import { prisma } from "@lib/db";
import { Position } from "@type/certificate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    // Fetch the certificate by ID
    const certificate = await prisma.certificate.findUnique({
      where: {
        id,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        positions: {
          include: {
            signature: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ message: "Certificate Not Found" }, { status: 404 });
    }

    return NextResponse.json(certificate, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      templatePath,
      templateUrl,
      templateWidth,
      templateHeight,
      positions,
      eventId,
    } = body;

    // Check if the certificate exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        positions: true
      }
    });

    if (!existingCertificate) {
      return NextResponse.json({ message: "Certificate Not Found" }, { status: 404 });
    }

    // Validate required fields
    if (!eventId) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    if (!positions || !Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json({ message: "At least one position is required" }, { status: 400 });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 400 });
    }

    // Update certificate using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update certificate
      await tx.certificate.update({
        where: { id },
        data: {
          templatePath: templatePath || existingCertificate.templatePath,
          templateUrl: templateUrl || existingCertificate.templateUrl,
          templateWidth: templateWidth || existingCertificate.templateWidth,
          templateHeight: templateHeight || existingCertificate.templateHeight,
          eventId,
          updatedAt: new Date(),
        }
      });

      // Get existing position IDs
      const existingPositionIds = existingCertificate.positions.map(p => p.id);
      
      // Update or create positions
      for (let index = 0; index < positions.length; index++) {
        const position = positions[index];
        const positionData = {
          certificateId: id,
          name: position.name || `Position ${index + 1}`,
          x: Number(position.x) || 0,
          y: Number(position.y) || 0,
          fontSize: Number(position.fontSize) || 24,
          type: position.type || 'text',
          width: Number(position.width) || 0,
          height: Number(position.height) || 0,
          signatureId: position.signatureId || null,
        };

        if (existingPositionIds[index]) {
          // Update existing position
          await tx.position.update({
            where: { id: existingPositionIds[index] },
            data: positionData
          });
        } else {
          // Create new position
          await tx.position.create({
            data: positionData
          });
        }
      }

      // Delete extra positions if new positions array is shorter
      if (positions.length < existingPositionIds.length) {
        const positionsToDelete = existingPositionIds.slice(positions.length);
        await tx.position.deleteMany({
          where: {
            id: {
              in: positionsToDelete
            }
          }
        });
      }

      // Return updated certificate with relations
      const certificateWithRelations = await tx.certificate.findUnique({
        where: { id },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            }
          },
          positions: {
            include: {
              signature: true,
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      return certificateWithRelations;
    });

    return NextResponse.json(
      {
        message: "Certificate updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error updating certificate:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = async (
  req: NextRequest,
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
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
