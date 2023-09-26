"use client";

import { Tabs as NextuiTabs, Tab } from "@nextui-org/react";
import Admin from "@/app/dashboard/admin";
import Director from "@/app/dashboard/director";
import Doctor from "@/app/dashboard/doctor";
import Secretary from "@/app/dashboard/secretary";
import { Role } from "@prisma/client";

export default function Tabs({
  role,
  centerId = "",
}: {
  role: Role;
  centerId?: string;
}) {
  return (
    <NextuiTabs fullWidth size="md" aria-label="Tabs form">
      {role === "ADMIN" && (
        <>
          <Tab key="ADMIN" title="Admin">
            <Admin />
          </Tab>
          <Tab key="DIRECTOR" title="Director">
            <Director />
          </Tab>
        </>
      )}
      <Tab key="DOCTOR" title="Doctor">
        <Doctor centerId={centerId} />
      </Tab>
      <Tab key="SECRETARY" title="Secretaria">
        <Secretary centerId={centerId} />
      </Tab>
    </NextuiTabs>
  );
}
