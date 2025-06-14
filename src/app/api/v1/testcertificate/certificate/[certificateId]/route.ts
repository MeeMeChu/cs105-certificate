import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function DELETE(request : NextApiRequest ,{params} : {params : {certificateId : string}}) {
  const prisma = new PrismaClient()
  try {
    const {certificateId} = params
    const deletedCer = await prisma.certificate.delete({
      where : {
        id : certificateId
      }
    })
    return NextResponse.json({
      status : 200,
      deletedCer
    })
  } catch (error : any) {
    return NextResponse.json({
      message : error.message
    })
  }
}

