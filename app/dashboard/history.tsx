"use client";

import Table from "@/app/table";
import { fetcher } from "@/lib/fetcher";
import { MedicalHistory } from "@prisma/client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Link } from "@nextui-org/react";
import { UpdateHistory } from "@/types/history";

const columns = [
  {
    key: "date",
    label: "FECHA",
    sortable: true,
  },
  {
    key: "patient.name",
    label: "PACIENTE",
    sortable: true,
  },
  {
    key: "doctor.center.name",
    label: "CENTRO",
    sortable: true,
  },
  {
    key: "doctor.name",
    label: "DOCTOR",
    sortable: true,
  },
  {
    key: "fileUrl",
    label: "ARCHIVO",
    sortable: false,
  },
];

export default function Appointments({
  className,
  centerId,
}: {
  className?: string;
  centerId: string;
}) {
  const router = useRouter();
  const {
    data: histories,
    isLoading: isLoadingHistories,
    mutate: mutateHistories,
  } = useSWR<MedicalHistory[]>(
    centerId ? "/api/history/center/" + centerId : "/api/history/",
    fetcher()
  );

  const handleDelete = async (id: string) => {
    const bodyRequest: UpdateHistory = {
      status: "CANCELLED",
    };

    const response = await fetch("/api/history/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyRequest),
    });

    const body = await response.json();

    if (response.ok) {
      mutateHistories();
    } else {
      console.log({ response, body });
    }
  };

  return (
    <>
      <Table
        className={className}
        ariaLabel="Tabla de historias médicas"
        renderCell={getKeyValue}
        isLoading={isLoadingHistories}
        columns={columns}
        INITIAL_VISIBLE_COLUMNS={columns.map((column) => column.key)}
        rows={histories || []}
        title="Historias médicas por eliminar"
        actions={{
          delete: (item) => {
            handleDelete(item.id);
          },
        }}
      />
    </>
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
    if (curr === "fileUrl") {
      return (
        <Link href={prev[curr]} isExternal showAnchorIcon>
          Abrir
        </Link>
      );
    }
    return prev[curr];
  }, item);
}
