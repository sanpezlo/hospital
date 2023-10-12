import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { Unauthorized } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "PATIENT")
      throw new Unauthorized("No autorizado");

    const histories = await prisma.medicalHistory.findMany({
      include: {
        doctor: {
          include: {
            center: true,
          },
        },
      },
      where: {
        patientId: session.user.id,
      },
    });

    return NextResponse.json(histories);
  });
}
