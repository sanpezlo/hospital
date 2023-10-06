import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateUserSchema } from "@/types/user";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");
    if (session.user.role !== "ADMIN" && session.user.role !== "DIRECTOR")
      throw new Forbidden("No autorizado");

    const body = await request.json();

    const updateUser = UpdateUserSchema.parse(body);

    if (updateUser.newPassword) {
      throw new BadRequest("No se puede cambiar la contraseña desde aquí");
    }

    const current = await prisma.user.findUnique({
      where: {
        id: params.userId,
        centerId:
          session.user.role === "DIRECTOR" ? session.user.centerId : undefined,
      },
    });

    if (!current) throw new BadRequest("El usuario no existe");

    if (updateUser.email !== current.email) {
      const exist = await prisma.user.findUnique({
        where: {
          email: updateUser.email,
        },
      });

      if (exist) throw new BadRequest("El correo ya está en uso");
    }

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: updateUser,
    });

    return NextResponse.json(user);
  });
}
