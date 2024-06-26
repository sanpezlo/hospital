"use client";

import "@uploadthing/react/styles.css";

import { UploadButton } from "@/lib/uploadthing";
import { MedicalHistory } from "@prisma/client";
import Table from "@/app/table";
import { Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UpdateHistory } from "@/types/history";

const columns = [
  {
    key: "date",
    label: "FECHA",
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

export default function MedicalHistory({
  className,
  patientId,
  medicalHistories,
}: {
  className?: string;
  patientId: string;
  medicalHistories: MedicalHistory[];
}) {
  console.log(medicalHistories);
  const router = useRouter();

  const handleRemove = async (id: string) => {
    const bodyRequest: UpdateHistory = {
      status: "PENDING",
    };

    const response = await fetch("/api/history/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyRequest),
    });

    const body = await response.json();

    if (!response.ok) {
      console.log({ response, body });
    }
  };

  return (
    <>
      <Table
        className={className}
        ariaLabel="Tabla de historias medicas"
        renderCell={getKeyValue}
        columns={columns}
        INITIAL_VISIBLE_COLUMNS={columns.map((column) => column.key)}
        rows={medicalHistories || []}
        title="Historias medicas"
        AddButton={
          <UploadButton
            endpoint={"pdfUploader"}
            content={{
              button: "Subir archivo",
            }}
            onClientUploadComplete={(res) => {
              router.refresh();
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR: ${error.message}`);
            }}
            input={{ patientId: patientId }}
          />
        }
        actions={{
          remove: (item) => {
            handleRemove(item.id);
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
