import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { CreateUserSchema } from "@/types/user";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest } from "http-errors";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const accounts = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
    });
    return NextResponse.json(accounts);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const body = await request.json();

    const createUser = CreateUserSchema.parse(body);

    const exist = await prisma.user.findUnique({
      where: {
        email: createUser.email,
      },
    });

    if (exist) throw new BadRequest("El correo electrónico ya existe");

    const hashedPassword = await hash("doctor", 10);

    const admin = await prisma.user.create({
      data: {
        name: createUser.name,
        email: createUser.email,
        hashedPassword,
        role: "DOCTOR",
        center: {
          connect: {
            id: createUser.centerId,
          },
        },
      },
    });
    return NextResponse.json(admin);
  });
}
