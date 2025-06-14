import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { generateCertificateForRegistration } from "@lib/certificateGenerator";

const prisma = new PrismaClient();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ eventId: string; regId: string }> }
) => {
  try {
    const { regId, eventId } = await params;

    // ดึงข้อมูลการลงทะเบียนสำหรับงานนั้นๆ
    const registration = await prisma.registration.findUnique({
      where: {
        id: regId,
        eventId: eventId, // ตรวจสอบว่าเป็น registration ของ event นี้
      },
      include: { event: true },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found for this event" },
        { status: 404 }
      );
    }

    // ตรวจสอบว่า check-in แล้วหรือยัง
    if (!registration.checkedIn) {
      return NextResponse.json(
        { message: "User has not checked in to the event" },
        { status: 400 }
      );
    }

    const fullname = `${registration.prefix || ""} ${registration.firstName} ${registration.lastName}`.trim();

    // Generate certificate using new system
    const certificatePDF = await generateCertificateForRegistration(
      registration.id
    );

    const msg = {
      to: registration.email,
      from: "chinnapong.dev@outlook.com",
      subject: `เกียรติบัตรสำหรับกิจกรรม ${registration.event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>เรียนคุณ ${fullname}</h2>
          <p>ขอบคุณที่เข้าร่วมกิจกรรม <strong>"${registration.event.title}"</strong></p>
          <p>ท่านสามารถดาวน์โหลดเกียรติบัตรได้จากไฟล์แนบ</p>
          <p>หรือตรวจสอบความถูกต้องได้ที่: ${process.env.NEXT_PUBLIC_URL}/verify/${registration.id}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            ขอบคุณสำหรับการเข้าร่วมกิจกรรมและการให้ความร่วมมืออย่างดี 
            เราหวังเป็นอย่างยิ่งว่าคุณจะเข้าร่วมกับเราอีกครั้งในกิจกรรมครั้งถัดไป
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${registration.firstName}-${registration.lastName}-certificate.pdf`,
          content: certificatePDF,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sendgrid.send(msg);
    console.log(`Certificate sent to ${registration.email}`);

    return NextResponse.json(
      {
        message: "Certificate sent successfully!",
        recipient: registration.email,
        registrationId: registration.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending certificate:", error);
    return NextResponse.json(
      { message: "Error sending certificate", error: String(error) },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ eventId: string; regId: string }> }
) => {
  try {
    const { regId, eventId } = await params;

    const registration = await prisma.registration.findUnique({
      where: {
        id: regId,
        eventId: eventId,
      },
      include: { event: true },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found for this event" },
        { status: 404 }
      );
    }

    // Generate certificate using new system
    const pdfBase64 = await generateCertificateForRegistration(
      registration.id
    );

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    // Create safe filename for international characters
    const safeName = `${registration.firstName}-${registration.lastName}`
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase();

    const filename = `${safeName}-certificate.pdf`;

    // Use RFC 5987 encoding for international filenames
    const encodedFilename = encodeURIComponent(filename);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
};
