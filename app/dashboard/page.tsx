import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Tabs from "@/app/dashboard/tabs";
import Center from "@/app/dashboard/center";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Centers from "@/app/centers";
import { prisma } from "@/lib/prisma";
import Workers from "@/app/dashboard/center/[centerId]/workers";
import BasicInformation from "@/app/dashboard/center/[centerId]/basic-information";
import { Center as CenterPrisma, User } from "@prisma/client";
import Appointments from "@/app/dashboard/appointments";
import MedicalHistory from "@/app/dashboard/history";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (
    session?.user.role !== "ADMIN" &&
    session?.user.role !== "DIRECTOR" &&
    session?.user.role !== "DOCTOR" &&
    session?.user.role !== "SECRETARY"
  )
    return redirect("/");

  const center =
    session.user.role === "ADMIN"
      ? null
      : await prisma.center.findUnique({
          where: {
            id: session.user.centerId as string,
          },
          include: {
            users: true,
          },
        });

  return (
    <>
      <h1 className="text-xl my-6">Panel de control</h1>

      <Divider />

      <div className="my-6 gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {session.user.role === "ADMIN" && (
          <>
            <div>
              <Card className="max-w-full">
                <CardHeader className="flex gap-4">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-md">Crear centros</h2>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="overflow-hidden">
                  <Center />
                </CardBody>
              </Card>
            </div>
          </>
        )}
        {(session.user.role === "DIRECTOR" ||
          session.user.role === "ADMIN") && (
          <div>
            <Card className="max-w-full">
              <CardHeader className="flex gap-4">
                <div className="flex flex-col gap-4">
                  <h2 className="text-md">Crear cuentas</h2>
                  <div className="text-small text-default-500">
                    Cada cuenta se creara con una contraseña por defecto:
                    <ul className="list-disc list-inside">
                      {session.user.role === "ADMIN" && (
                        <>
                          <li>Admin: admin</li>
                          <li>Director: director</li>
                        </>
                      )}
                      <li>Doctor: doctor</li>
                      <li>Secretaria: secretary</li>
                    </ul>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="overflow-hidden">
                <Tabs
                  role={session.user.role}
                  centerId={session.user?.centerId || ""}
                />
              </CardBody>
            </Card>
          </div>
        )}

        {session.user.role === "ADMIN" && (
          <Centers isAdmin className="col-span-1 sm:col-span-2 xl:col-span-3" />
        )}
        {session.user.role !== "ADMIN" && (
          <>
            <div id="basic-info">
              <BasicInformation
                center={center as CenterPrisma}
                isEditable={session.user.role === "DIRECTOR"}
              />
            </div>

            <Workers
              center={
                center as {
                  users: User[];
                } & CenterPrisma
              }
              className="col-span-1 sm:col-span-2 xl:col-span-3"
            />
          </>
        )}

        {(session.user.role === "SECRETARY" ||
          session.user.role === "DIRECTOR") && (
          <Appointments
            centerId={session.user.centerId || ""}
            className="col-span-1 sm:col-span-2 xl:col-span-3"
          />
        )}

        {(session.user.role === "DIRECTOR" ||
          session.user.role === "ADMIN") && (
          <MedicalHistory
            centerId={session.user.centerId || ""}
            className="col-span-1 sm:col-span-2 xl:col-span-3"
          />
        )}
      </div>
    </>
  );
}
