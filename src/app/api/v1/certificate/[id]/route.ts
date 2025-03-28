import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { generateCertificatePDF } from "@lib/certificateGenerator";

const prisma = new PrismaClient();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    // ดึงข้อมูลการลงทะเบียนสำหรับงานนั้นๆ
    const registrations = await prisma.registration.findUnique({
      where: { id: id},
      include: { event: true },
    });

    if (!registrations) {
      return NextResponse.json({ message: "No registrations found" }, { status: 404 });
    }

    
      const fullname = registrations.firstName + " " + registrations.lastName;
      const certificatePDF = await generateCertificatePDF(fullname, registrations.id);

      const msg = {
        to: registrations.email,
        from: "chinnapong.dev@outlook.com",
        subject: `เกียรติบัตรสำหรับกิจกรรม ${registrations.event.title}`,
        text: `เรียนคุณ ${fullname}, นี่คือเกียรติบัตรสำหรับที่คุณได้เข้าร่วมในกิจกรรม"${registrations.event.title}"
        ขอบคุณสำหรับการเข้าร่วมกิจกรรมและการให้ความร่วมมืออย่างดี เราหวังเป็นอย่างยิ่งว่าคุณจะเข้าร่วมกับเราอีกครั้งในกิจกรรมครั้งถัดไป `,
        attachments: [
          {
            filename: `${registrations.firstName}-certificate.pdf`,
            content: certificatePDF,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };

      try {
        await sendgrid.send(msg);
        console.log(`Certificate sent to ${registrations.email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${registrations.email}:`, emailError);
      }
    

    return NextResponse.json({ message: "Certificates sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending certificates:", error);
    return NextResponse.json({ message: "Error sending certificates" }, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const registration = await prisma.registration.findUnique({
      where: { 
        id
       },
      include: { event: true },
    });

    if (!registration) {
      return NextResponse.json({ message: "Registration not found" }, { status: 404 });
    }

    const fullname = registration.firstName + " " + registration.lastName;
    const pdfBase64 = await generateCertificatePDF(fullname, registration.id);
    
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${registration.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}