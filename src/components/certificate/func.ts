import { api } from "@/src/lib/axios-config";
import { PDFDocument, PDFImage } from "pdf-lib";

type Position = {
  id: number;
  name: string;
  x: number;
  y: number;
  fontSize: number;
  width: number;
  height: number;
};

/**
 * Sends the blank PDF to your backend for text-overlay
 * and then downloads the returned PDF.
 */
export const handleGenerateCer = async (
  positions: Position[],
  url: string,
  canvas: HTMLCanvasElement
) => {
  if (!canvas) return;

  try {
    const pageWidth = canvas.width;
    const textX = positions[0].x;
    const textY = positions[0].y;

    // Fetch and Base64-encode the template PDF
    const pdfBuffer = await fetch(url).then((r) => r.arrayBuffer());
    const pdfBase64 = btoa(
      String.fromCharCode(...new Uint8Array(pdfBuffer))
    );

    // Send to backend
    const response = await api.post(
      "/testcertificate",
      { pageWidth, textX, textY, originalPdfBase64: pdfBase64 },
      { responseType: "arraybuffer" }
    );

    // Download returned PDF
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `certificate-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err: any) {
    console.error("handleGenerateCer error:", err);
  }
};

/**
 * Embeds a PNG into every position on the template PDF
 * (generated entirely client-side) and downloads it.
 */
export const handleDowLoad = async (
  templateURL: string,
  imageUrl: string,
  positions: Position[],
  canvas: HTMLCanvasElement
) => {
  if (!canvas) return;

  try {
    // 1. Load the blank PDF and start a new PDFDocument
    const pdfBuffer = await fetch(templateURL).then((r) =>
      r.arrayBuffer()
    );
    const doc = await PDFDocument.create();
    const [embeddedPage] = await doc.embedPdf(pdfBuffer, [0]);
    const { width: w, height: h } = embeddedPage.size();
    const page = doc.addPage([w, h]);
    page.drawPage(embeddedPage, { x: 0, y: 0, width: w, height: h });

    // 2. Fetch the PNG once and embed it
    const pngBytes = await fetch(imageUrl).then((r) => r.arrayBuffer());
    const pngImage: PDFImage = await doc.embedPng(pngBytes);

    // 3. Compute canvas↔PDF scaling
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 4. Draw the image at each specified position
    for (const pos of positions) {
      const imgW = (pos.id === 0 ? 32 : pos.width) * scaleX;
      const imgH = (pos.id === 0 ? 32 : pos.height) * scaleY;
      const canvasX = pos.x * scaleX;
      const canvasY = pos.y * scaleY;
      const pdfY = h - canvasY - imgH; // flip y-coordinate

      page.drawImage(pngImage, {
        x: canvasX,
        y: pdfY,
        width: imgW,
        height: imgH,
      });
    }

    // 5. Save and download
    const newBytes = await doc.save();
    const blob = new Blob([newBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `signed-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error: any) {
    console.error("handleDowLoad error:", error);
  }
};
