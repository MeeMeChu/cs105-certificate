import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Position } from "@/src/types/certificate";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.certificate.findMany({
      include : {
        signaturePositions : true
      }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {

    const { eventId, positions, originalPdfBase64 } = await request.json() as {
      eventId: string;
      fontSize: number;
      positions: Position[];
      originalPdfBase64: string;
    }
    if (!positions || eventId === "") {
      return NextResponse.json({
        message: "Does not have event or Position of signature",
      });
    }
    const buffer = Buffer.from(originalPdfBase64, 'base64');
    const text = positions[0];
    const certificate = await prisma.certificate.create({
      data: {
        eventId,
        fontSize: text.fontSize,
        textY: text.y,
        // textX: text.x,
      },
    });

    await Promise.all(
      positions.map(async (position: Position) => {
        if (position.id !== 0) {
          const pos = await prisma.signaturePosition.create({
            data: {
              x: position.x,
              y: position.y,
              certificateId: certificate.id,
              height: position.height,
              width: position.width,
              signatureId: position.sigId.toString(),
            },
          });
        }
      })
    );
    
    const uploadPath = path.join(process.cwd(), 'public', 'certificate', `certificate-${certificate.id}.pdf`);
    await fs.writeFile(uploadPath, buffer);
    return NextResponse.json({
      status: 200,
      certificate,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
    });
  }
}



// export async function POST(request: NextRequest) {
//   const prisma = new PrismaClient();
//   try {
//     const { pageWidth, textX, textY, originalPdfBase64 } = await request.json();

//     const users = await prisma.user.findMany({
//       select: { firstName: true, lastName: true },
//     });

//     const originalPdfBytes = Buffer.from(originalPdfBase64, "base64");
//     const pdfDoc = await PDFDocument.load(originalPdfBytes);

//     //  embed ฟอนต์และเตรียมหน้า
//     const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const page = pdfDoc.getPages()[0];
//     const { width: pw, height: ph } = page.getSize();
//     const fontSize = 32;

//     // วาดข้อความสำหรับแต่ละคนลงบน pdf
//     const u = users[0];
//     const text = `${u.firstName} ${u.lastName}`;

//     const x = textX;

//     const y = ph - textY - fontSize;
//     page.drawText(text, {
//       x,
//       y,
//       size: fontSize,
//       font: helvetica,
//       color: rgb(0, 0, 0),
//     });

//     const pdfBytes = await pdfDoc.save();

//     return new NextResponse(pdfBytes, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="certificates.pdf"`,
//       },
//     });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
