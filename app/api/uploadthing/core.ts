import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Unauthorized, Forbidden } from "http-errors";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: { maxFileCount: 1, maxFileSize: "8MB" },
  })
    .input(
      z.object({
        patientId: z.string(),
      })
    )
    .middleware(async ({ req, input }) => {
      const session = await getServerSession(authOptions);

      if (!session) throw new Unauthorized("No autorizado");
      if (session.user.role === "PATIENT" || session.user.role === "SECRETARY")
        throw new Forbidden("No autorizado");

      return { userId: session.user.id, patientId: input.patientId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.medicalHistory.create({
        data: {
          doctorId: metadata.userId,
          patientId: metadata.patientId,
          fileUrl: file.url,
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
