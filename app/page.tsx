import MedicalAppointment from "@/app/medical-appointment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import SignUp from "@/app/auth/signup/signup";

import Centers from "@/app/centers";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="my-6 gap-12 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-12 md:col-span-2">
          <h2 className="tracking-tight inline font-semibold text-5xl text-center">
            <span>Consulta nuestros</span>
            <div>
              <span className="tracking-tight inline font-semibold from-[#FF1CF7] to-[#b249f8] text-5xl bg-clip-text text-transparent bg-gradient-to-b">
                centros médicos
              </span>{" "}
              disponibles
            </div>
          </h2>
          <Centers isAdmin={session?.user.role === "ADMIN"} />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="tracking-tight font-semibold text-5xl">
            <span>Tu salud es importante</span>
            <div>
              solicita una{" "}
              <span className="from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent bg-gradient-to-b">
                cita médica
              </span>{" "}
              ahora mismo
            </div>
          </h2>
          <p className="w-full md:w-1/2 my-2 text-lg lg:text-xl font-normal text-default-500 block max-w-full">
            te brindamos la oportunidad de cuidar de ti mismo de una manera
            simple y eficaz.
          </p>
        </div>

        <div className="grid place-items-center">
          {session?.user.role === "PATIENT" && <MedicalAppointment />}
          {session === null && (
            <Card className="sm:mx-auto sm:w-full sm:max-w-sm">
              <CardHeader className="flex">
                <div className="flex justify-center items-center w-full">
                  <h1 className="text-3xl m-auto">Regístrate</h1>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="overflow-hidden">
                <SignUp />
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
