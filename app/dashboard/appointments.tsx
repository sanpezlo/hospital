"use client";

import Table from "@/app/table";
import { fetcher } from "@/lib/fetcher";
import { medicalAppointmentStatus } from "@/lib/parse";
import { MedicalAppointment } from "@prisma/client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Approve from "@/app/dashboard/approve";
import { useState } from "react";
import { useDisclosure } from "@nextui-org/react";

const columns = [
  {
    key: "date",
    label: "FECHA DE SOLICITUD",
    sortable: true,
  },
  {
    key: "specialization",
    label: "ESPECIALIDAD",
    sortable: false,
  },
  {
    key: "doctor.name",
    label: "DOCTOR",
    sortable: true,
  },
  {
    key: "patient.name",
    label: "PACIENTE",
    sortable: true,
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
  const { data: appointments, isLoading: isLoadingAppointments } = useSWR<
    MedicalAppointment[]
  >("/api/appointment/center/" + centerId, fetcher());

  const [data, setData] = useState({
    id: "",
    doctorId: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Table
        className={className}
        ariaLabel="Tabla de citas por aprobar"
        renderCell={getKeyValue}
        isLoading={isLoadingAppointments}
        columns={columns}
        INITIAL_VISIBLE_COLUMNS={columns.map((column) => column.key)}
        rows={appointments || []}
        title="Citas por aprobar"
        filterSearch={(items, filterValue) =>
          items.filter((item) =>
            item.doctor.name.toLowerCase().includes(filterValue.toLowerCase())
          )
        }
        searchBy="por nombre del doctor..."
        actions={{
          view: (item) => {
            router.push(`/dashboard/user/${item.doctor.id}`);
          },
          approve: (item) => {
            setData({ id: item.id, doctorId: item.doctor.id });
            onOpen();
          },
        }}
      />
      <Approve
        doctorId={data.doctorId}
        id={data.id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
    if (curr === "status") return medicalAppointmentStatus(prev[curr]);
    return prev[curr];
  }, item);
}
