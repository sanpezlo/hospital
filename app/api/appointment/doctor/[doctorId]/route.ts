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

    const appointments =
      session.user.role === "PATIENT"
        ? await prisma.medicalAppointment.findMany({
            where: {
              doctorId: params.doctorId,
              status: "ACCEPTED",
              date: {
                gte: new Date(),
              },
            },
            select: {
              date: true,
            },
          })
        : await prisma.medicalAppointment.findMany({
            where: {
              doctorId: params.doctorId,
            },
          });

    return NextResponse.json(appointments);
  });
}
