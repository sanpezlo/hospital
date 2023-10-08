"use client";

import Table from "@/app/table";
import { standardTime } from "@/lib/parse";
import { Chip } from "@nextui-org/react";
import { Schedule } from "@prisma/client";
import { useRouter } from "next/navigation";

const columns = [
  {
    key: "startTime",
    label: "HORA INICIO",
    sortable: false,
  },
  {
    key: "departureTime",
    label: "HORA SALIDA",
    sortable: false,
  },
  {
    key: "days",
    label: "DIAS",
    sortable: false,
  },
];

export default function Schedules({
  className,
  schedules,
}: {
  className?: string;
  schedules: Schedule[];
}) {
  const router = useRouter();

  return (
    <>
      <Table
        className={className}
        ariaLabel="Tabla de horario"
        renderCell={getKeyValue}
        columns={columns}
        INITIAL_VISIBLE_COLUMNS={columns.map((column) => column.key)}
        rows={schedules || []}
        title="Horario"
      />
    </>
  );
}

function getKeyValue(item: any, columnKey: any): any {
  return ("" + columnKey).split(".").reduce((prev, curr) => {
    if (curr === "startTime" || curr === "departureTime")
      return standardTime(prev[curr] as string);
    if (curr === "days")
      return (
        <>
          {(prev[curr] as string[]).map((day) => (
            <Chip key={day} className="mx-1">
              {day}
            </Chip>
          ))}
        </>
      );

    return prev[curr];
  }, item);
}
