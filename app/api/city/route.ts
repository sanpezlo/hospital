import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateCitySchema } from "@/types/city";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  return errorHandler(async () => {
    const cities = await prisma.city.findMany();
    return NextResponse.json(cities);
  });
}

export async function POST(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "ADMIN") throw new Forbidden("No autorizado");

    const body = await request.json();

    const createCity = CreateCitySchema.parse(body);

    const exist = await prisma.city.findUnique({
      where: {
        name_departmentId: {
          name: createCity.name,
          departmentId: createCity.departmentId,
        },
      },
    });

    if (exist) throw new BadRequest("El nombre de la ciudad ya existe");

    const city = await prisma.city.create({
      data: {
        name: createCity.name,
        departmentId: createCity.departmentId,
      },
    });
    return NextResponse.json(city);
  });
}
