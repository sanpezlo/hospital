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
    if (
      session.user.role !== "PATIENT" &&
      session.user.role !== "DOCTOR" &&
      session.user.role !== "DIRECTOR"
    )
      throw new Unauthorized("No autorizado");

    const appointments =
      session.user.role === "PATIENT"
        ? await prisma.medicalAppointment.findMany({
            where: {
              patientId: session.user.id,
            },
            include: {
              doctor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  center: true,
                },
              },
            },
          })
        : await prisma.medicalAppointment.findMany({
            where: {
              doctorId: session.user.id,
            },
            include: {
              patient: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });

    return NextResponse.json(appointments);
  });
}
