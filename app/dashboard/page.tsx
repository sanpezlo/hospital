import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Tabs from "@/app/dashboard/tabs";
import Center from "@/app/dashboard/center";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return redirect("/");

  return (
    <>
      <h1 className="text-xl">Panel de control</h1>

      <div className="mt-6 gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <Card className="max-w-full">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col gap-3">
                <h2 className="text-md">Crear centros</h2>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-hidden">
              <Center />
            </CardBody>
          </Card>
        </div>
        <div>
          <Card className="max-w-full">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col gap-3">
                <h2 className="text-md">Crear cuentas</h2>
                <div className="text-small text-default-500">
                  Cada cuenta se creara con una contraseña por defecto
                  <ul className="list-disc list-inside">
                    <li>Admin: admin</li>
                    <li>Director: director</li>
                    <li>Doctor: doctor</li>
                    <li>Secretaria: secretary</li>
                  </ul>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-hidden">
              <Tabs />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}