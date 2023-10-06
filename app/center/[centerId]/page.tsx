import Workers from "@/app/center/[centerId]/workers";
import BasicInformation from "@/app/center/[centerId]/basic-information";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CenterPage({
  params,
}: {
  params: { centerId: string };
}) {
  const center = await prisma.center.findUnique({
    where: {
      id: params.centerId,
    },
    include: {
      users: true,
    },
  });

  if (!center) redirect("/");

  return (
    <>
      <h1 className="text-xl my-6">
        Centro{" "}
        <Chip size="sm" color="primary">
          {center.name}
        </Chip>
      </h1>

      <Divider />

      <div className="my-6 gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div id="basic-info">
          <BasicInformation center={center} />
        </div>

        <Workers center={center} className="col-span-1 sm:col-span-2" />
      </div>
    </>
  );
}
