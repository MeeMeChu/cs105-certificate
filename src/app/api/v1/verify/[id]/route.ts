// app/api/verify/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request,{ params }: { params: { id: string }}) {
  try {
    const uuid =  params.id;
    console.log("Received UUID:", uuid); // ตรวจสอบค่า uuid ที่ได้รับจาก request

    if (uuid) {
      // ค้นหาผู้ใช้จากฐานข้อมูลที่มี uuid ตรงกับค่าที่รับมา
      const registration = await prisma.registration.findUnique({
        where: { id: uuid },
        include: { event: true }, // ถ้าต้องการข้อมูล Event ด้วย
      });

      if (registration) {
        // ถ้าพบผู้ลงทะเบียน
        return new Response(
          JSON.stringify({ message: `Verified! Welcome, ${registration.firstName} ${registration.lastName}.` }),
          { status: 200 }
        );
      } else {
        // ถ้าไม่พบ uuid ที่ตรงกับผู้ใช้ในฐานข้อมูล
        return new Response(
          JSON.stringify({ message: "Invalid UUID" }),
          { status: 400 }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ message: "UUID not provided" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ message: 'Error processing the request' }),
      { status: 500 }
    );
  }
}
