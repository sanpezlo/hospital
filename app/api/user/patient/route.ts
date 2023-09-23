import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function GET(request: NextRequest) {
  try {
    const accounts = await prisma.user.findMany({
      where: {
        role: "PATIENT",
      },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {},
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
    const { name, email, password } = await request.json();

    // TODO: zod

    const exist = await prisma.user.findUnique({
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

    const hashedPassword = await hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "PATIENT",
      },
    });
    return NextResponse.json(admin);
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
