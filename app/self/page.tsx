import Self from "@/components/self";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SelfPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <h1>Self</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Self />
    </>
  );
}
