import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";

// Import fontkit without types
import * as fontkit from "fontkit"; // This approach skips the type checking for fontkit

const prisma = new PrismaClient();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// Create Certificates In Format PDF
const generateCertificatePDF = async (fullName: string, uid: string) => {
  try {
    const templatePath = path.join(process.cwd(), "public", "certificate-template.pdf");
    const templateBytes = await fs.readFile(templatePath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Register fontkit with pdf-lib (this works even if the types don't match perfectly)
    pdfDoc.registerFontkit(fontkit as any); // Type casting to bypass the type issue

    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Load Thai font
    const thaiFontPath = path.join(process.cwd(), "public", "fonts", "NotoSansThai-Regular.ttf");
    const thaiFontBytes = await fs.readFile(thaiFontPath);
    
    // Embed the font
    const thaiFont = await pdfDoc.embedFont(thaiFontBytes);

    // Use Thai font size 24 for the name
    const fontSize = 24;

    // Calculate position for the name (centered)
    const textWidth = thaiFont.widthOfTextAtSize(fullName, fontSize);
    const textHeight = fontSize;
    const x = (width - textWidth) / 2;
    const y = (height - textHeight) / 2;

    // Draw the Thai text (fullName)
    firstPage.drawText(fullName, {
      x,
      y,
      size: fontSize,
      font: thaiFont,
      color: rgb(0, 0, 0),
    });

    // QR CODE
    const qrCodeURL = `${process.env.NEXT_PUBLIC_API_URL}/verify/${uid}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL);
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

    firstPage.drawImage(qrImage, { x: firstPage.getWidth() - 120, y: 50, width: 100, height: 100 });

    return Buffer.from(await pdfDoc.save()).toString("base64");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// API to send Certificate to Event Registrants
export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    // Retrieve registrations for the event
    const registrations = await prisma.registration.findMany({
      where: { eventId: id },
      include: { event: true },
    });

    if (registrations.length === 0) {
      return NextResponse.json({ message: "No registrations found" }, { status: 404 });
    }

    // Loop through each user and send the certificate
    for (const user of registrations) {
      const fullname = user.firstName + " " + user.lastName;
      const certificatePDF = await generateCertificatePDF(fullname, user.id);

      const msg = {
        to: user.email,
        from: "chinnapong.dev@outlook.com", // Use a verified SendGrid email
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
    return NextResponse.json({ message: "Error sending certificates"
     }, { status: 500 });
  }
};
