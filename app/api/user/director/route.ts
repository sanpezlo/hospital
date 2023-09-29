import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { CreateUserSchema } from "@/types/user";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const accounts = await prisma.user.findMany({
      where: {
        role: "DIRECTOR",
      },
    });
    return NextResponse.json(accounts);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "ADMIN") throw new Forbidden("No autorizado");

    const body = await request.json();

    const createUser = CreateUserSchema.parse(body);

    const exist = await prisma.user.findUnique({
      where: {
        email: createUser.email,
      },
    });

    if (exist) throw new BadRequest("El correo electrónico ya existe");

    const hashedPassword = await hash("director", 10);

    const admin = await prisma.user.create({
      data: {
        name: createUser.name,
        email: createUser.email,
        hashedPassword,
        role: "DIRECTOR",
        specialization: createUser.specialization,
        schedules: {
          create: createUser.schedules,
        },
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
