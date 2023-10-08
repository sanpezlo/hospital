import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Unauthorized } from "http-errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");

    const schedules = await prisma.schedule.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
    });
    return NextResponse.json(schedules);
  });
}
