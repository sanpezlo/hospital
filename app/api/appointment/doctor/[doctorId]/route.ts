import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { Unauthorized } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");

    const appointments = await prisma.medicalAppointment.findMany({
      where: {
        doctorId: params.doctorId,
      },
      select: {
        date: true,
      },
    });

    return NextResponse.json(appointments);
  });
}
