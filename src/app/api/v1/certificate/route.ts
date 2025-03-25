import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { generateCertificatePDF } from "@lib/certificateGenerator";

const prisma = new PrismaClient();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // ดึงข้อมูลการลงทะเบียนสำหรับงานนั้นๆ
    const registrations = await prisma.registration.findMany({
      where: { eventId: id },
      include: { event: true },
    });

    if (registrations.length === 0) {
      return NextResponse.json({ message: "No registrations found" }, { status: 404 });
    }

    // ลูปผ่านผู้ใช้แต่ละคนแล้วส่งใบรับรอง
    for (const user of registrations) {
      const fullname = user.firstName + " " + user.lastName;
      const certificatePDF = await generateCertificatePDF(fullname, user.id);

      const msg = {
        to: user.email,
        from: "chinnapong.dev@outlook.com",
        subject: `เกียรติบัตรสำหรับกิจกรรม ${user.event.title}`,
        text: `เรียนคุณ ${fullname}, นี่คือเกียรติบัตรสำหรับที่คุณได้เข้าร่วมในกิจกรรม"${user.event.title}"
        ขอบคุณสำหรับการเข้าร่วมกิจกรรมและการให้ความร่วมมืออย่างดี เราหวังเป็นอย่างยิ่งว่าคุณจะเข้าร่วมกับเราอีกครั้งในกิจกรรมครั้งถัดไป `,
        attachments: [
          {
            filename: `${user.firstName}-certificate.pdf`,
            content: certificatePDF,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };

      try {
        await sendgrid.send(msg);
        console.log(`Certificate sent to ${user.email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${user.email}:`, emailError);
      }
    }

    return NextResponse.json({ message: "Certificates sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending certificates:", error);
    return NextResponse.json({ message: "Error sending certificates" }, { status: 500 });
  }
};

