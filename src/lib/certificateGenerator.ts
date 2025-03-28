import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";
import * as fontkit from "fontkit";

export const generateCertificatePDF = async (fullName: string, uid: string) => {
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