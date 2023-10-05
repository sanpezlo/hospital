import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { UpdateCenterSchema } from "@/types/center";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role === "ADMIN" || session.user.role === "PATIENT")
      throw new Forbidden("No autorizado");

    const center = await prisma.center.findUnique({
      where: {
        id: session.user.centerId as string,
      },
      include: {
        users: true,
      },
    });
    return NextResponse.json(center);
  });
}

export async function PUT(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "DIRECTOR") throw new Forbidden("No autorizado");

    const body = await request.json();

    const updateCenter = UpdateCenterSchema.parse(body);

    const currentCenter = await prisma.center.findUnique({
      where: {
        id: session.user.centerId as string,
      },
    });

    if (!currentCenter) throw new BadRequest("El centro no existe");

    if (updateCenter.name !== currentCenter.name) {
      const exist = await prisma.center.findUnique({
        where: {
          name: updateCenter.name,
        },
      });

      if (exist)
        throw new BadRequest("El nombre del centro de salud ya existe");
    }

    const center = await prisma.center.update({
      where: {
        id: session.user.centerId as string,
      },
      data: updateCenter,
    });
    return NextResponse.json(center);
  });
}
