import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  return errorHandler(async () => {
    const schedules = await prisma.schedule.findMany({
      where: {
        user: {
          id: params.doctorId,
        },
      },
    });
    return NextResponse.json(schedules);
  });
}
