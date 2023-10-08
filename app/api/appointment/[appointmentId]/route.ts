import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UpdateAppointmentSchema } from "@/types/appointment";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      appointmentId: string;
    };
  }
) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "SECRETARY" && session.user.role !== "DIRECTOR")
      throw new Forbidden("No autorizado");

    const updateAppointment = UpdateAppointmentSchema.parse(request.body);

    const appointment = await prisma.medicalAppointment.update({
      where: {
        id: params.appointmentId,
      },
      data: {
        date: updateAppointment.date,
        doctor: updateAppointment.doctorId
          ? { connect: { id: updateAppointment.doctorId } }
          : undefined,
        status: "ACCEPTED",
      },
    });

    return NextResponse.json(appointment);
  });
}
