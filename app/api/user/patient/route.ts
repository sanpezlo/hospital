import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { CreatePatientSchema } from "@/types/user";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest } from "http-errors";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const accounts = await prisma.user.findMany({
      where: {
        role: "PATIENT",
      },
    });
    return NextResponse.json(accounts);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const body = await request.json();

    const createAccount = CreatePatientSchema.parse(body);

    const exist = await prisma.user.findUnique({
      where: {
        email: createAccount.email,
      },
    });

    if (exist) throw new BadRequest("El correo electrónico ya existe");

    const hashedPassword = await hash(createAccount.password, 10);

    const admin = await prisma.user.create({
      data: {
        name: createAccount.name,
        email: createAccount.email,
        hashedPassword,
        role: "PATIENT",
      },
    });
    return NextResponse.json(admin);
  });
}
