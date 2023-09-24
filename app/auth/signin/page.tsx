import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import SignIn from "@/app/auth/signin/signin";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Card className="sm:mx-auto sm:w-full sm:max-w-sm">
        <CardHeader className="flex">
          <div className="flex justify-center items-center w-full">
            <h1 className="text-3xl m-auto">Iniciar sesión</h1>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="overflow-hidden">
          <SignIn isError={Boolean(searchParams.error)} />
        </CardBody>
      </Card>
    </div>
  );
}
