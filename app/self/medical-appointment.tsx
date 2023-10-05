"use client";

import React from "react";

import useSWR from "swr";
import { MedicalAppointment, MedicalAppointmentStatus } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import Table from "../table";
import { medicalAppointmentStatus } from "@/lib/parse";
import { useRouter } from "next/navigation";

const columnsPatient = [
  {
    key: "date",
    label: "FECHA",
    sortable: true,
  },
  {
    key: "doctor.name",
    label: "DOCTOR",
    sortable: true,
  },
  {
    key: "doctor.center.name",
    label: "CENTRO",
    sortable: true,
  },

  {
    key: "doctor.center.department",
    label: "DEPARTAMENTO",
    sortable: true,
  },

  {
    key: "doctor.center.city",
    label: "CIUDAD",
    sortable: true,
  },

  {
    key: "doctor.center.address",
    label: "DIRECCIÓN",
    sortable: false,
  },

  {
    key: "doctor.center.phone",
    label: "TELÉFONO",
    sortable: false,
  },

  {
    key: "status",
    label: "ESTADO",
    sortable: false,
  },
];

const columnsDoctor = [
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
    key: "patient.email",
    label: "CORREO ELECTRÓNICO",
    sortable: true,
  },
  {
    key: "status",
    label: "ESTADO",
    sortable: false,
  },
];

export default function MedicalAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: appointments, isLoading: isLoadingAppointments } = useSWR<
    MedicalAppointment[]
  >("/api/appointment/self", fetcher());

  return (
    <Table
      onPressAdd={
        session?.user.role === "PATIENT"
          ? () => {
              router.push("/#appointment");
            }
          : undefined
      }
      ariaLabel="Tabla de mis citas"
      renderCell={getKeyValue}
      columns={
        session?.user.role === "PATIENT" ? columnsPatient : columnsDoctor
      }
      INITIAL_VISIBLE_COLUMNS={(session?.user.role === "PATIENT"
        ? columnsPatient
        : columnsDoctor
      ).map((column) => column.key)}
      rows={appointments || []}
      isLoading={isLoadingAppointments}
      title="Mis citas"
      filterSearch={
        session?.user.role === "PATIENT"
          ? (items, filterValue) =>
              items.filter((item) =>
                item.doctor.name
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              )
          : (items, filterValue) =>
              items.filter((item) =>
                item.patient.name
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              )
      }
      filterOptions={{
        status: {
          name: "Estado",
          options: [
            {
              name: medicalAppointmentStatus(MedicalAppointmentStatus.PENDING),
              key: MedicalAppointmentStatus.PENDING,
            },
            {
              name: medicalAppointmentStatus(MedicalAppointmentStatus.ACCEPTED),
              key: MedicalAppointmentStatus.ACCEPTED,
            },
            {
              name: medicalAppointmentStatus(
                MedicalAppointmentStatus.COMPLETED
              ),
              key: MedicalAppointmentStatus.COMPLETED,
            },
          ],
        },
      }}
      searchBy={
        session?.user.role === "PATIENT"
          ? "por nombre del doctor..."
          : "por nombre del paciente..."
      }
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
