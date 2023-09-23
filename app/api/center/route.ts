import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const centers = await prisma.center.findMany();
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
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, city, phone, email } = await request.json();

    // TODO: zod

    const exist = await prisma.center.findUnique({
      where: {
        email,
      },
    });

    if (exist)
      return NextResponse.json(
        {
          error: "Email already exist",
        },
        {
          status: 400,
        }
      );

    const center = await prisma.center.create({
      data: {
        name,
        address,
        city,
        phone,
        email,
      },
    });
    return NextResponse.json(center);
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
    return NextResponse.error();
  }
}
