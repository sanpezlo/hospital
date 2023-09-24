import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/error-hanlder";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const centers = await prisma.center.findMany({
      where: {
        users: {
          none: {
            role: "DIRECTOR",
          },
        },
      },
    });
    return NextResponse.json(centers);
  });
}
