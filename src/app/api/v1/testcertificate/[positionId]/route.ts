import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(request : NextApiRequest,{params} : {params : {positionId : string}}) {
  try {
    const {positionId} = params;
    const deletedPosition = await prisma.signaturePosition.delete({
      where : {
        id : positionId
      }
    });
    return NextResponse.json(deletedPosition);
  } catch (error : any) {
    return NextResponse.json({
      message : error.message
    });
  }
}