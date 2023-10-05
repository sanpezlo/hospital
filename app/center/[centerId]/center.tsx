"use client";

import Table from "@/app/table";
import { role } from "@/lib/parse";
import { Center, Role, User } from "@prisma/client";

const columns = [
  {
    key: "name",
    label: "NOMBRE",
    sortable: true,
  },
  {
    key: "email",
    label: "CORREO ELECTRÓNICO",
    sortable: false,
  },
  {
    key: "role",
    label: "ROL",
    sortable: false,
  },
  {
    key: "specialization",
    label: "ESPECIALIDAD",
    sortable: false,
  },
];

export default function Center({
  center,
  className,
}: {
  center: {
    users: User[];
  } & Center;
  className?: string;
}) {
  return (
    <>
      <Table
        className={className}
        ariaLabel="Tabla de trabajadores"
        renderCell={(item, key) => {
          return item["" + key];
        }}
        columns={columns}
        INITIAL_VISIBLE_COLUMNS={columns.map((column) => column.key)}
        rows={center?.users || []}
        title="Trabajadores"
        filterSearch={(items, filterValue) =>
          items.filter((item) =>
            item.name.toLowerCase().includes(filterValue.toLowerCase())
          )
        }
        searchBy="por nombre..."
        filterOptions={{
          role: {
            name: "Rol",
            options: [
              {
                key: Role.DIRECTOR,
                name: role(Role.DIRECTOR),
              },
              {
                key: Role.DOCTOR,
                name: role(Role.DOCTOR),
              },
              {
                key: Role.SECRETARY,
                name: role(Role.SECRETARY),
              },
            ],
          },
        }}
      />
    </>
  );
}
