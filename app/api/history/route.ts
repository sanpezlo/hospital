import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "ADMIN") throw new Forbidden("No autorizado");

    const histories = await prisma.medicalHistory.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        doctor: {
          include: {
            center: true,
          },
        },
        patient: true,
      },
    });

    return NextResponse.json(histories);
  });
}
