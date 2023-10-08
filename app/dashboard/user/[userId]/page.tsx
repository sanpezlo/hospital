import MedicalAppointment from "@/app/dashboard/user/[userId]/medical-appointment";
import BasicInformation from "@/app/dashboard/user/[userId]/basic-information";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { role } from "@/lib/parse";
import Schedules from "./schedules";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "PATIENT") return redirect("/");

  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      doctorAppointment: {
        include: {
          patient: true,
        },
      },
      patientAppointment: {
        include: {
          doctor: {
            include: {
              center: true,
            },
          },
        },
      },
      schedules: true,
    },
  });

  if (!user) redirect("/dashboard");

  if (user.role === "ADMIN" && session?.user.role !== "ADMIN")
    redirect("/dashboard");

  if (
    session?.user.role !== "ADMIN" &&
    user.role !== "ADMIN" &&
    user.role !== "PATIENT" &&
    user.centerId !== session?.user.centerId
  )
    redirect("/dashboard");

  return (
    <>
      <h1 className="text-xl my-6">
        Cuenta{" "}
        <Chip
          size="sm"
          color={
            user.role === "ADMIN"
              ? "danger"
              : user.role === "DIRECTOR"
              ? "success"
              : user.role === "DOCTOR"
              ? "primary"
              : user.role === "SECRETARY"
              ? "warning"
              : "default"
          }
        >
          {role(user.role)}
        </Chip>
      </h1>

      <Divider />

      <div className="my-6 gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div id="basic-info">
          <BasicInformation
            user={user}
            isEditable={
              session?.user.role === "ADMIN" ||
              (session?.user.role === "DIRECTOR" && user.role !== "PATIENT")
            }
          />
        </div>

        {(user.role === "PATIENT" ||
          user.role === "DOCTOR" ||
          user.role === "DIRECTOR") && (
          <MedicalAppointment
            className="col-span-1 sm:col-span-2"
            appointments={
              user.role === "PATIENT"
                ? user.patientAppointment
                : user.doctorAppointment
            }
            role={user.role}
          />
        )}

        {Boolean(user.centerId) && (
          <Schedules
            schedules={user.schedules}
            className="col-span-1 sm:col-span-2 xl:col-span-3"
          />
        )}
      </div>
    </>
  );
}
