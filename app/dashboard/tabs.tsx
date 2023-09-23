"use client";

import { Tabs as NextuiTabs, Tab } from "@nextui-org/react";
import Admin from "@/app/dashboard/admin";
import Director from "@/app/dashboard/director";
import Doctor from "@/app/dashboard/doctor";
import Secretary from "@/app/dashboard/secretary";

export default function Tabs() {
  return (
    <NextuiTabs fullWidth size="md" aria-label="Tabs form">
      <Tab key="ADMIN" title="Admin">
        <Admin />
      </Tab>
      <Tab key="DIRECTOR" title="Director">
        <Director />
      </Tab>
      <Tab key="DOCTOR" title="Doctor">
        <Doctor />
      </Tab>
      <Tab key="SECRETARY" title="Secretaria">
        <Secretary />
      </Tab>
    </NextuiTabs>
  );
}
