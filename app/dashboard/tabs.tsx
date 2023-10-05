"use client";

import { Tabs as NextuiTabs, Tab } from "@nextui-org/react";
import Admin from "@/app/dashboard/admin";
import Director from "@/app/dashboard/director";
import Doctor from "@/app/dashboard/doctor";
import Secretary from "@/app/dashboard/secretary";
import { type Role } from "@prisma/client";

const adminTabs = [
  {
    role: "ADMIN",
    title: "Admin",
    component: <Admin />,
  },
  {
    role: "DIRECTOR",
    title: "Director",
    component: <Director />,
  },
];

export default function Tabs({
  role,
  centerId = "",
}: {
  role: Role;
  centerId?: string;
}) {
  return (
    <NextuiTabs id="users" fullWidth size="md" aria-label="Tabs form">
      {role === "ADMIN" &&
        adminTabs.map((tab) => {
          return (
            <Tab key={tab.role} title={tab.title}>
              {tab.component}
            </Tab>
          );
        })}

      <Tab key="DOCTOR" title="Doctor">
        <Doctor centerId={centerId} />
      </Tab>

      <Tab key="SECRETARY" title="Secretaria">
        <Secretary centerId={centerId} />
      </Tab>
    </NextuiTabs>
  );
}
