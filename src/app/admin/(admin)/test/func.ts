import { api } from "@/src/lib/axios-config";
import { PDFDocument } from "pdf-lib";
type Position = {
  id: number;
  name: string;
  x: number;
  y: number;
  fontSize: number;
  width : number;
  height : number;
};

export  const handleGenerateCer = async (
    positions: Position[],
    url: string,
    canvas : HTMLCanvasElement
  ) => {
    try {
      // รับ canvas element มา
      // const canvas = canvasRef.current;
      if (!canvas) return;
      const pageWidth = canvas.width;
      // ตำแหน่งของ text ในแนวแกน y
      const textX = positions[0].x
      const textY = positions[0].y;
  
      // โหลด PDF เป็น ArrayBuffer
      const pdfBuffer = await fetch(url).then(r => r.arrayBuffer());
  
      // แปลงเป็น Base64 string
      const pdfBytes = new Uint8Array(pdfBuffer);
      let binary = '';
      for (let i = 0; i < pdfBytes.byteLength; i++) {
        binary += String.fromCharCode(pdfBytes[i]);
      }
      const pdfBase64 = btoa(binary);
  
      //ส่ง JSON พร้อม Base64 เนื่องจาก json รองรับแค่ text-base
      const response = await api.post(
        '/testcertificate',
        { pageWidth,textX, textY, originalPdfBase64: pdfBase64 },
        { responseType: 'arraybuffer' }
      );
  
      //รับ PDF กลับมาเป็นไบนารีแล้วดาวน์โหลด
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `certificate-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
  
    } catch (err: any) {
      console.error('handleGenerateCer error:', err);
      // setError(err.message);
    }
  };

export const handleDowLoad = async (templateURL : string,imageUrl : string,positions : Position[],canvas : HTMLCanvasElement) => {
    try {
      const pdfBuffer = await fetch(templateURL).then((r) => r.arrayBuffer());
      const doc = await PDFDocument.create();
      const embeddedPage = await doc.embedPdf(pdfBuffer, [0]);
      const { width: w, height: h } = embeddedPage[0].size();
      const page = doc.addPage([w, h]);
      page.drawPage(embeddedPage[0], { x: 0, y: 0, width: w, height: h });

      const pngBuffer = await fetch(imageUrl).then((r) => r.arrayBuffer());
      await doc.embedPng(pngBuffer);
      // const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      for (const pos of positions){
        const pngBytes = await fetch(imageUrl).then((res) =>
          res.arrayBuffer()
        );
        const pngImage = await doc.embedPng(pngBytes);
        const imgWidthPt = pos.id ===0 ? 32 * scaleX : pos.width * scaleX;
        const imgHeightPt = pos.id ===0 ? 32 * scaleY : pos.height * scaleY;
        const canvasX =  pos.x * scaleX;
        const canvasY = pos.y * scaleY;
        const xPDF = canvasX;
        const yPDF = h - canvasY - imgHeightPt;
        page.drawImage(pngImage, {
          x: xPDF,
          y: yPDF,
          width: imgWidthPt,
          height: imgHeightPt,
        });
      };
      const newBytes = await doc.save();
      const blob = new Blob([newBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `signed-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error: any) {
      console.log(error.message);
    }
    
  };