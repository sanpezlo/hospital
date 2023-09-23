import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
