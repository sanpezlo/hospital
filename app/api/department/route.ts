import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateDepartmentSchema } from "@/types/department";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const departments = await prisma.department.findMany();
    return NextResponse.json(departments);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "ADMIN") throw new Forbidden("No autorizado");

    const body = await request.json();

    const createDepartment = CreateDepartmentSchema.parse(body);

    const exist = await prisma.department.findUnique({
      where: {
        name: createDepartment.name,
      },
    });

    if (exist) throw new BadRequest("El nombre del departamento ya existe");

    const department = await prisma.department.create({
      data: {
        name: createDepartment.name,
      },
    });
    return NextResponse.json(department);
  });
}
