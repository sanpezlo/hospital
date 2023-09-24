import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import SignUp from "@/app/auth/signup/signup";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
    </div>
  );
}
