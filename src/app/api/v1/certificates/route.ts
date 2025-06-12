import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/db";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const certificates = await prisma.certificate.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true
          }
        },
        positions: {
          include: {
            signature: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
    const totalCount = await prisma.certificate.count();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: certificates,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { templatePath, templateUrl, templateWidth, templateHeight, positions, eventId } = body;

    if (!templatePath || !eventId || !positions || !Array.isArray(positions)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    for (const pos of positions) {
      if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        return NextResponse.json(
          { error: 'Position x and y must be numbers' },
          { status: 400 }
        );
      }
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Create certificate with positions
    const certificate = await prisma.certificate.create({
      data: {
        eventId,
        templatePath,
        templateUrl,
        templateWidth: templateWidth || null,
        templateHeight: templateHeight || null,
        positions: {
          create: positions.map((pos: any) => ({
            certificateId: pos.certificateId,
            x: pos.x,
            y: pos.y,
            fontSize: pos.fontSize || 24,
            type: pos.type,
            width: pos.width || null,
            height: pos.height || null,
            signatureId: pos.sigId || null,
          }))
        }
      },
      include: {
        event: {
          select: {
            id: true,
            title: true
          }
        },
        positions: {
          include: {
            signature: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Certificate created successfully',
      data: certificate,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
  
}