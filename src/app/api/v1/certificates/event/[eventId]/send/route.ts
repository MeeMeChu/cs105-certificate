import sendgrid from "@sendgrid/mail";
import { NextResponse } from "next/server";
import { prisma } from "@lib/db";
import { generateCertificateForRegistration } from "@lib/certificateGenerator";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// Send certificates for all users registered for a specific event
export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    // ดึงข้อมูลการลงทะเบียนสำหรับงานนั้นๆ
    const registrations = await prisma.registration.findMany({
      where: {
        eventId,
        checkedIn: true, // ส่งเฉพาะคนที่ check-in แล้ว
      },
      include: { event: true },
    });

    if (registrations.length === 0) {
      return NextResponse.json(
        { message: "No checked-in registrations found" },
        { status: 404 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // ลูปผ่านผู้ใช้แต่ละคนแล้วส่งใบรับรอง
    for (const registration of registrations) {
      try {
        const fullname = `${registration.prefix || ""} ${registration.firstName} ${registration.lastName}`.trim();

        // Generate certificate using new system
        const certificatePDF = await generateCertificateForRegistration(
          registration.id,
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
        results.success++;
      } catch (emailError) {
        console.error(`Error sending email to ${registration.email}:`, emailError);
        results.failed++;
        results.errors.push(`Failed to send to ${registration.email}: ${emailError}`);
      }
    }

    return NextResponse.json(
      {
        message: "Certificate sending completed",
        results,
        totalProcessed: registrations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending certificates:", error);
    return NextResponse.json(
      { message: "Error sending certificates", error: String(error) },
      { status: 500 }
    );
  }
}
