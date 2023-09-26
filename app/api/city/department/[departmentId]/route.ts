import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { errorHandler } from "@/lib/error-hanlder";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  return errorHandler(async () => {
    const cities = await prisma.city.findMany({
      where: {
        departmentId: params.departmentId,
      },
    });
    return NextResponse.json(cities);
  });
}
