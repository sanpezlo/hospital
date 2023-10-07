import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { Unauthorized } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateAppointmentSchema } from "@/types/appointment";

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");

    const body = await request.json();

    const createAppointment = CreateAppointmentSchema.parse(body);

    const appointment = await prisma.medicalAppointment.create({
      data: {
        type: createAppointment.type,
        specialization: createAppointment.specialization,
        date: createAppointment.date,
        doctor: {
          connect: {
            id: createAppointment.doctorId,
          },
        },
        patient: {
          connect: {
            id: createAppointment.patientId,
          },
        },
        status:
          createAppointment.type === "Consulta con especialista"
            ? "PENDING"
            : "ACCEPTED",
      },
    });
    return NextResponse.json(appointment);
  });
}
