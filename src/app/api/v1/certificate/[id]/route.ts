import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";
import * as fontkit from "fontkit"; 

const prisma = new PrismaClient();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// Create Certificates
const generateCertificatePDF = async (fullName: string, uid: string) => {
  try {
    const templatePath = path.join(process.cwd(), "public", "certificate-template.pdf");
    const templateBytes = await fs.readFile(templatePath);

    // Load Certi PDF :)
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Register fontkit
    pdfDoc.registerFontkit(fontkit as any);

    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Load Thai Fonts and Eng Fonts
    const thaiFontPath = path.join(process.cwd(), "public", "fonts", "NotoSansThai-Regular.ttf");
    const englishFontPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");

    const thaiFontBytes = await fs.readFile(thaiFontPath);
    const englishFontBytes = await fs.readFile(englishFontPath);

    const thaiFont = await pdfDoc.embedFont(thaiFontBytes);
    const englishFont = await pdfDoc.embedFont(englishFontBytes);

    const fontSize = 32;

    // คำนวณตำแหน่งของข้อความ (ศูนย์กลาง)
    const textWidthThai = thaiFont.widthOfTextAtSize(fullName, fontSize);
    const textWidthEnglish = englishFont.widthOfTextAtSize(fullName, fontSize);
    const textWidth = fullName.match(/[ก-๙]/) ? textWidthThai : textWidthEnglish;  // ตรวจสอบว่าเป็นภาษาไทยหรือไม่
    const textHeight = fontSize;
    const x = (width - textWidth) / 2;
    const y = ((height - textHeight) / 2) + 50;

    // วาดข้อความด้วยฟอนต์ที่เหมาะสม
    firstPage.drawText(fullName, {
      x,
      y,
      size: fontSize,
      font: fullName.match(/[ก-๙]/) ? thaiFont : englishFont,
      color: rgb(0, 0, 0),
    });

    // สร้าง QR Code
    const qrCodeURL = `${process.env.NEXT_PUBLIC_URL}/verify/${uid}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL);
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

    firstPage.drawImage(qrImage, { 
      x: 50, 
      y: 60,
      width: 100, 
      height: 100 
    });

    return Buffer.from(await pdfDoc.save()).toString("base64");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// API สำหรับส่งใบรับรองให้กับผู้ลงทะเบียนในงาน
export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

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
        from: "chinnapong.dev@outlook.com", // ใช้อีเมลที่ยืนยันกับ SendGrid
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
