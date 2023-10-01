import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import { role } from "@/lib/parse";
import MedicalAppointment from "@/app/self/medical-appointment";
import BasicInformation from "@/app/self/basic-information";

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
        <div id="basic-info">
          <BasicInformation />
        </div>

        {(session.user.role === "PATIENT" ||
          session.user.role === "DOCTOR" ||
          session.user.role === "DIRECTOR") && (
          <div id="appointments" className="col-span-1 sm:col-span-2">
            <MedicalAppointment />
          </div>
        )}
      </div>
    </>
  );
}
