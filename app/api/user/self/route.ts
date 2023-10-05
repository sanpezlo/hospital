import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import { UpdateUserSchema } from "@/types/user";
import { errorHandler } from "@/lib/error-hanlder";
import { BadRequest, Unauthorized, Forbidden } from "http-errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: NextRequest) {
  return errorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Unauthorized("No autorizado");

    const body = await request.json();

    const updateUser = UpdateUserSchema.parse(body);

    if (updateUser.newPassword) {
      if (!updateUser.password)
        throw new BadRequest("La contraseña actual es requerida");

      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user)
        throw new Forbidden("No tienes permisos para realizar esta acción");

      const passwordMatch = await compare(
        updateUser.password,
        user.hashedPassword
      );

      if (!passwordMatch) throw new BadRequest("La contraseña es incorrecta");
    }

    if (updateUser.email !== session.user.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: updateUser.email,
        },
      });

      if (user) throw new BadRequest("El correo ya está en uso");
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateUser.newPassword
        ? {
            hashedPassword: await hash(updateUser.newPassword, 10),
          }
        : updateUser,
    });

    return NextResponse.json(user);
  });
}
