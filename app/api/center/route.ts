import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateCenterSchema } from "@/types/center";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest } from "http-errors";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const centers = await prisma.center.findMany();
    return NextResponse.json(centers);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const body = await request.json();

    const createCenter = CreateCenterSchema.parse(body);

    const exist = await prisma.center.findUnique({
      where: {
        name: createCenter.name,
      },
    });

    if (exist) throw new BadRequest("El nombre del centro de salud ya existe");

    const center = await prisma.center.create({
      data: {
        name: createCenter.name,
        address: createCenter.address,
        city: createCenter.city,
        phone: createCenter.phone,
        email: createCenter.email,
      },
    });
    return NextResponse.json(center);
  });
}
