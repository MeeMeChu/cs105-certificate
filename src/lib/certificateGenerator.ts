import { PDFDocument, rgb, PDFImage } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";
import * as fontkit from "fontkit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CertificateData {
  participantName: string;
  eventTitle: string;
  eventDate: string;
  registrationId: string;
  customFields?: Record<string, string>;
}

// Function to generate certificate PDF with template and positions
export const generateCertificateWithTemplate = async (
  certificateId: string,
  data: CertificateData
): Promise<string> => {
  try {
    // Get certificate template and positions from database
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        event: true,
        positions: {
          include: {
            signature: true
          }
        }
      }
    });

    if (!certificate) {
      throw new Error("Certificate template not found");
    }

    // Create new PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit as any);

    // Load template image
    let templateImage: PDFImage;
    
    if (certificate.templatePath) {
      const templatePath = path.join(process.cwd(), "public", `/uploads/${certificate.templatePath}`);
      const imageBytes = await fs.readFile(templatePath);
      const imageExt = templatePath.split('.').pop()?.toLowerCase();
      
      if (imageExt === 'png') {
        templateImage = await pdfDoc.embedPng(imageBytes);
      } else {
        templateImage = await pdfDoc.embedJpg(imageBytes);
      }
    } else if (certificate.templateUrl) {
      const response = await fetch(certificate.templateUrl);
      const imageBytes = await response.arrayBuffer();
      const imageExt = certificate.templateUrl.split('.').pop()?.toLowerCase();
      
      if (imageExt === 'png') {
        templateImage = await pdfDoc.embedPng(new Uint8Array(imageBytes));
      } else {
        templateImage = await pdfDoc.embedJpg(new Uint8Array(imageBytes));
      }
    } else {
      throw new Error("No template image found");
    }

    // Create page with template image dimensions
    const page = pdfDoc.addPage([templateImage.width, templateImage.height]);
    
    // Draw template image as background
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: templateImage.width,
      height: templateImage.height,
    });

    // Load fonts
    const thaiFontPath = path.join(process.cwd(), "public", "fonts", "NotoSansThai-Regular.ttf");
    const englishFontPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");

    const thaiFontBytes = await fs.readFile(thaiFontPath);
    const englishFontBytes = await fs.readFile(englishFontPath);

    const thaiFont = await pdfDoc.embedFont(thaiFontBytes);
    const englishFont = await pdfDoc.embedFont(englishFontBytes);

    const getFont = (text: string) => {
      return text.match(/[ก-๙]/) ? thaiFont : englishFont;
    };

    // Process each position
    for (const position of certificate.positions) {
      if (position.type === "text") {
        let textContent = data.participantName;
        console.log("🚀 ~ textContent:", textContent)

        if (textContent) {
          // คำนวณตำแหน่งที่ถูกต้อง
          let scaleX = 1;
          let scaleY = 1;
          
          if (certificate.templateWidth && certificate.templateHeight) {
            scaleX = templateImage.width / certificate.templateWidth;
            scaleY = templateImage.height / certificate.templateHeight;
          }

          const scaledFontSize = position.fontSize * Math.min(scaleX, scaleY);
          const font = getFont(textContent);
          
          // คำนวณความกว้างของข้อความเพื่อหาจุดกึ่งกลาง
          const textWidth = font.widthOfTextAtSize(textContent, scaledFontSize);
          const textHeight = scaledFontSize;
          
          // คำนวณตำแหน่งให้ข้อความอยู่ตรงกลางของจุดที่เลือก
          const actualX = (position.x * scaleX) - (textWidth / 2);
          const actualY = (templateImage.height - position.y * scaleY) - (textHeight / 2);

          page.drawText(textContent, {
            x: actualX,
            y: actualY,
            size: scaledFontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
      } else if (position.type === "signature" && position.signature) {
        const signaturePath = path.join(process.cwd(), "public", position.signature.path);
        const signatureBytes = await fs.readFile(signaturePath);
        const signatureExt = signaturePath.split('.').pop()?.toLowerCase();
        
        let signatureImage: PDFImage;
        if (signatureExt === 'png') {
          signatureImage = await pdfDoc.embedPng(signatureBytes);
        } else {
          signatureImage = await pdfDoc.embedJpg(signatureBytes);
        }

        // คำนวณตำแหน่งและขนาดที่ถูกต้อง
        let scaleX = 1;
        let scaleY = 1;
        
        if (certificate.templateWidth && certificate.templateHeight) {
          scaleX = templateImage.width / certificate.templateWidth;
          scaleY = templateImage.height / certificate.templateHeight;
        }

        const actualWidth = (position.width || 100) * scaleX;
        const actualHeight = (position.height || 50) * scaleY;
        
        // คำนวณตำแหน่งให้ลายเซ็นอยู่ตรงกลางของจุดที่เลือก
        const actualX = (position.x * scaleX) - (actualWidth / 2);
        const actualY = (templateImage.height - position.y * scaleY) - (actualHeight / 2);

        page.drawImage(signatureImage, {
          x: actualX,
          y: actualY,
          width: actualWidth,
          height: actualHeight,
        });
      }
    }

    // Add QR Code for verification
    const qrCodeURL = `${process.env.NEXT_PUBLIC_URL}/verify/${data.registrationId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL, {
      width: 150,
      margin: 1,
    });
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

    page.drawImage(qrImage, {
      x: templateImage.width - 120,
      y: 20,
      width: 100,
      height: 100,
    });

    return Buffer.from(await pdfDoc.save()).toString("base64");
  } catch (error) {
    console.error("Error generating PDF with template:", error);
    throw error;
  }
};

// Function to generate certificate for a specific registration
export const generateCertificateForRegistration = async (
  registrationId: string,
  certificateId?: string
): Promise<string> => {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true }
    });

    if (!registration) {
      throw new Error("Registration not found");
    }

    // If no certificateId provided, find the first certificate for this event
    let targetCertificateId = certificateId;
    if (!targetCertificateId) {
      const eventCertificate = await prisma.certificate.findFirst({
        where: { eventId: registration.eventId }
      });
      
      if (!eventCertificate) {
        // Fallback to legacy PDF generation
        return generateCertificatePDF(
          `${registration.prefix || ''} ${registration.firstName} ${registration.lastName}`.trim(),
          registration.id
        );
      }
      
      targetCertificateId = eventCertificate.id;
    }
    
    const certificateData: CertificateData = {
      participantName: `${registration.prefix || ''} ${registration.firstName} ${registration.lastName}`.trim(),
      eventTitle: registration.event.title,
      eventDate: registration.event.startDate.toISOString(),
      registrationId: registration.id,
    };

    return await generateCertificateWithTemplate(targetCertificateId, certificateData);
  } catch (error) {
    console.error("Error generating certificate for registration:", error);
    throw error;
  }
};

// ของเก่า
// Legacy function for backward compatibility
export const generateCertificatePDF = async (fullName: string, uid: string): Promise<string> => {
  try {
    const templatePath = path.join(process.cwd(), "public", "certificate-template.pdf");
    const templateBytes = await fs.readFile(templatePath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit as any);

    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

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