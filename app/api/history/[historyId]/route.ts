import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UpdateHistorySchema } from "@/types/history";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { historyId: string } }
) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "DIRECTOR" &&
      session.user.role !== "DOCTOR"
    )
      throw new Forbidden("No autorizado");

    const body = await request.json();

    const updateHistory = UpdateHistorySchema.parse(body);

    const currentHistory = await prisma.medicalHistory.findUnique({
      where: {
        id: params.historyId,
      },
    });

    if (!currentHistory) throw new BadRequest("La historia no existe");

    const history = await prisma.medicalHistory.update({
      where: {
        id: params.historyId,
      },
      data: {
        status: updateHistory.status,
      },
    });
    return NextResponse.json(history);
  });
}
