import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { errorHandler } from "@/lib/error-hanlder";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return errorHandler(async () => {
    const center = await prisma.center.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(center);
  });
}
