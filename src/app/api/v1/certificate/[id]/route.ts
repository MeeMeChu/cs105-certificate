import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";




const prisma = new PrismaClient();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);


// Create Certificates In Format PDF
const generateCertificatePDF = async (fullName: string, uid: string) => {
  const templatePath = path.join(process.cwd(), "public", "certificate-template.pdf");
  const templateBytes = await fs.readFile(templatePath);
 
  const pdfDoc = await PDFDocument.load(templateBytes);
  const firstPage = pdfDoc.getPages()[0];
  const { width, height } = firstPage.getSize();

   // กำหนดฟอนต์ขนาด 24 สำหรับข้อความ
   const fontSize = 24;

   // คำนวณตำแหน่ง X และ Y สำหรับให้ข้อความอยู่ตรงกลาง
   const textWidth = fontSize * fullName.length * 0.6; // ประมาณความกว้างของข้อความ
   const textHeight = fontSize; // ความสูงของข้อความ (ตามขนาดฟอนต์)
   const x = (width - textWidth) / 2;  // คำนวณตำแหน่ง X ตรงกลาง
   const y = (height - textHeight) / 2;  // คำนวณตำแหน่ง Y ตรงกลาง
 
   firstPage.drawText(fullName, { x, y, size: fontSize, color: rgb(0, 0, 0) });



  // QR CODE 
  const qrCodeURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify/${uid}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL);
  const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

  firstPage.drawImage(qrImage, { x: firstPage.getWidth() - 120, y: 50, width: 100, height: 100 });

  return Buffer.from(await pdfDoc.save()).toString("base64");
};

// API ส่ง Certificate ไปยังผู้ลงทะเบียนใน Event
export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id} = await params
    // const apiKey = req.headers.get('apiKey');
    // if (apiKey !== "480cc812-26d6-45d9-a690-44477ce1ca92") {
    //   return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
    // }

    // ดึงผู้ลงทะเบียนใน Event นี้จาก Database
    const registrations = await prisma.registration.findMany({
      where: { eventId: id },
      include: { event: true },
    });

    if (registrations.length === 0) {
      return NextResponse.json({ message: "No registrations found" }, { status: 404 });
    }

    // วนลูปส่ง Certificate ให้แต่ละคน
    for (const user of registrations) {
      const fullname= user.firstName+"  "+user.lastName
      const certificatePDF = await generateCertificatePDF(fullname, user.id);

      const msg = {
        to: user.email,
        from: "chinnapong.dev@outlook.com",
        subject: `Your Certificate for ${user.event.title}`,
        text: `Dear ${fullname}, here is your certificate for attending "${user.event.title}"!`,
        attachments: [
          {
            filename: `${user.firstName}-certificate.pdf`,
            content: certificatePDF,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };

      await sendgrid.send(msg);
    }

    return NextResponse.json({ message: "Certificates sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending certificates:", error);
    return NextResponse.json({ message: "Error sending certificates", error }, { status: 500 });
  }
};
