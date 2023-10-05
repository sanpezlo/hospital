"use client";

import React from "react";

import useSWR from "swr";
import { Center } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import Table from "@/app/table";
import { medicalAppointmentStatus } from "@/lib/parse";
import { useRouter } from "next/navigation";

const columns = [
  {
    key: "name",
    label: "NOMBRE",
    sortable: true,
  },
  {
    key: "department",
    label: "DEPARTAMENTO",
    sortable: true,
  },
  {
    key: "city",
    label: "CIUDAD",
    sortable: true,
  },
  {
    key: "address",
    label: "DIRECCIÓN",
    sortable: false,
  },
  {
    key: "phone",
    label: "TELÉFONO",
    sortable: false,
  },
  {
    key: "email",
    label: "CORREO ELECTRÓNICO",
    sortable: false,
  },
];

export default function Centers({
  className = "",
  isAdmin = false,
}: {
  className?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();

  const { data: centers, isLoading: isLoadingCenters } = useSWR<Center[]>(
    "/api/center",
    fetcher()
  );

  return (
    <Table
      className={className}
      onPressAdd={
        isAdmin
          ? () => {
              router.push("/dashboard#center");
            }
          : undefined
      }
      ariaLabel="Tabla de mis citas"
      renderCell={getKeyValue}
      columns={columns}
      INITIAL_VISIBLE_COLUMNS={columns.map((column) => column.key)}
      rows={centers || []}
      isLoading={isLoadingCenters}
      title="Centros"
      filterSearch={(items, filterValue) =>
        items.filter((item) =>
          item.name.toLowerCase().includes(filterValue.toLowerCase())
        )
      }
      searchBy="por nombre..."
      actions={{
        view: (item) => {
          isAdmin
            ? router.push(`/dashboard/center/${item.id}`)
            : router.push(`/center/${item.id}`);
        },
      }}
    />
  );
}

function getKeyValue(item: any, columnKey: any): any {
  return ("" + columnKey).split(".").reduce((prev, curr) => {
    if (curr === "date")
      return (
        new Date(prev[curr]).toLocaleDateString("es-CO") +
        " " +
        new Date(prev[curr]).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/Bogota",
        })
      );
    if (curr === "status") return medicalAppointmentStatus(prev[curr]);
    return prev[curr];
  }, item);
}
