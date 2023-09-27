import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Chip } from "@nextui-org/chip";
import { PencilIcon } from "@heroicons/react/24/solid";
import { role } from "@/lib/parse";

export default async function SelfPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");

  return (
    <>
      <h1 className="text-xl my-6">
        Mi cuenta{" "}
        <Chip
          size="sm"
          color={
            session?.user.role === "ADMIN"
              ? "danger"
              : session?.user.role === "DIRECTOR"
              ? "success"
              : session?.user.role === "DOCTOR"
              ? "primary"
              : session?.user.role === "SECRETARY"
              ? "warning"
              : "default"
          }
        >
          {role(session.user.role)}
        </Chip>
      </h1>

      <Divider />

      <div className="my-6 gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <Card className="max-w-full">
            <CardHeader className="flex gap-4 justify-between">
              <h2 className="text-md">Información básica</h2>
              <Tooltip content="Editar">
                <Button isIconOnly aria-label="Editar" variant="flat">
                  <PencilIcon className="w-4" />
                </Button>
              </Tooltip>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-hidden">
              <form className="flex flex-col gap-4">
                <Input
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                  value={session.user.name || ""}
                  disabled
                />
                <Input
                  label="Correo electrónico"
                  placeholder="Ingrese su correo electrónico"
                  value={session.user.email || ""}
                  disabled
                />
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
