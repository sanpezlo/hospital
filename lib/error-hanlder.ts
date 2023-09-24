import { isHttpError } from "http-errors";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function errorHandler(handler: () => Promise<unknown>) {
  try {
    return await handler();
  } catch (error) {
    if (isHttpError(error) && error.expose)
      return NextResponse.json(
        {
          error: { message: error.message },
        },
        {
          status: error.statusCode,
        }
      );
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          error: { message: "Solicitud incorrecta", error: error.format() },
        },
        {
          status: 400,
        }
      );
    return NextResponse.json(
      {
        error: { message: "Error interno del servidor", error: error },
      },
      {
        status: 500,
      }
    );
  }
}
