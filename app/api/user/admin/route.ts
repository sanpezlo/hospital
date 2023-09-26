import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { CreateAdminSchema } from "@/types/user";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "ADMIN") throw new Forbidden("No autorizado");

    const accounts = await prisma.user.findMany({
      where: {
        role: "ADMIN",
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

    const createAdmin = CreateAdminSchema.parse(body);

    const exist = await prisma.user.findUnique({
      where: {
        email: createAdmin.email,
      },
    });

    if (exist) throw new BadRequest("El correo electrónico ya existe");

    const hashedPassword = await hash("admin", 10);

    const admin = await prisma.user.create({
      data: {
        name: createAdmin.name,
        email: createAdmin.email,
        hashedPassword,
        role: "ADMIN",
      },
    });
    return NextResponse.json(admin);
  });
}
