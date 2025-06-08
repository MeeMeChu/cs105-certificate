import { NextResponse,NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  try {
    const prisma = new PrismaClient();
    const signatures = await prisma.signature.findMany({
      select: {
        id: true,
        path: true,
      },
    });
    return NextResponse.json(signatures);
  } catch (error) {
    console.error("Error fetching signatures from database:", error);
    return NextResponse.json({ error: "Failed to fetch signatures" }, { status: 500 });
  }
}

export async function POST(request : NextRequest) {
  try {
    const data = await request.formData()
    const fname = data.get('fname')?.toString().trim()
    const lname = data.get('lname')?.toString().trim()
    const fileEntry = data.get('file');
    const file: File | null = fileEntry instanceof File ? fileEntry : null;
    if(!file || !fname || !lname) {
      return NextResponse.json({
        status : 404
      })
    }

    const name = `${fname} ${lname}`
    const prisma = new PrismaClient()
    const signature = await prisma.signature.create({
      data : {
        name : name,
        path : `signature-${name}.png`
      },
      
    })
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadPath = path.join(process.cwd(), "public", "signatures",`signature-${name}.png`);
    await fs.writeFile(uploadPath,buffer)
    console.log(signature)
    return NextResponse.json({
      status : 200,
      data : signature
    })
  } catch (error : any) {
    return NextResponse.json({
      status : 500,
      message : error.message
    })
  }
}