import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { CreateUserSchema, UpdateUserSchema } from "@/types/user";
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

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...updateUser,
        hashedPassword: updateUser.password
          ? await hash(updateUser.password, 10)
          : undefined,
      },
    });

    return NextResponse.json(user);
  });
}
