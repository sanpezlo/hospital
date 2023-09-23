import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOut from "@/app/auth/signout/signout";

export default async function SignOutPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");

  return (
    <>
      <SignOut />
    </>
  );
}
