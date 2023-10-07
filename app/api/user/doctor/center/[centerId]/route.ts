import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { centerId: string } }
) {
  return errorHandler(async () => {
    const accounts = await prisma.user.findMany({
      where: {
        OR: [
          {
            role: "DOCTOR",
          },
          {
            role: "DIRECTOR",
          },
        ],
        specialization: request.nextUrl.searchParams.get("specialization"),
        centerId: params.centerId,
      },
    });
    return NextResponse.json(accounts);
  });
}
