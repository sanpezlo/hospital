"use client";

// import { fetcher } from "@/lib/fetcher";
// import {
//   Table,
//   TableBody,
//   TableCell as NextuiTableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
//   SortDescriptor,
//   Selection,
// } from "@nextui-org/react";
// import { MedicalAppointment } from "@prisma/client";
// import { useMemo, useState } from "react";
// import useSWR from "swr";

// const columns = [
//   { name: "ID", uid: "id", sortable: true },
//   { name: "NAME", uid: "name", sortable: true },
//   { name: "AGE", uid: "age", sortable: true },
//   { name: "ROLE", uid: "role", sortable: true },
//   { name: "TEAM", uid: "team" },
//   { name: "EMAIL", uid: "email" },
//   { name: "STATUS", uid: "status", sortable: true },
//   { name: "ACTIONS", uid: "actions" },
// ];

// const statusOptions = [
//   { name: "Pendiente", uid: "PENDING" },
//   { name: "Aceptada", uid: "ACCEPTED" },
//   { name: "Completada", uid: "COMPLETED" },
// ];

// const INITIAL_VISIBLE_COLUMNS = ["status"];

// export default function MedicalAppointment() {
//   const { data: appointments, isLoading: isLoadingAppointments } = useSWR<
//     MedicalAppointment[]
//   >("/api/appointment/self", fetcher());

//   // const [visibleColumns, setVisibleColumns] = useState<Selection>(
//   //   new Set(INITIAL_VISIBLE_COLUMNS)
//   // );
//   // const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
//   //   column: "status",
//   //   direction: "ascending",
//   // });
//   // const [statusFilter, setStatusFilter] = useState<Selection>("all");

//   // const headerColumns = useMemo(() => {
//   //   if (visibleColumns === "all") return columns;

//   //   return columns.filter((column) =>
//   //     Array.from(visibleColumns).includes(column.uid)
//   //   );
//   // }, [visibleColumns]);

//   // const filteredItems = useMemo(() => {
//   //   let filteredUsers = [...(appointments || [])];

//   //   // if (hasSearchFilter) {
//   //   //   filteredUsers = filteredUsers.filter((user) =>
//   //   //     user.name.toLowerCase().includes(filterValue.toLowerCase()),
//   //   //   );
//   //   // }

//   //   if (
//   //     statusFilter !== "all" &&
//   //     Array.from(statusFilter).length !== statusOptions.length
//   //   ) {
//   //     filteredUsers = filteredUsers.filter((user) =>
//   //       Array.from(statusFilter).includes(user.status)
//   //     );
//   //   }

//   //   return filteredUsers;
//   // }, [appointments /*, filterValue*/, statusFilter]);

//   // const sortedItems = useMemo(() => {
//   //   return [...(appointments || [])].sort(
//   //     (a: MedicalAppointment, b: MedicalAppointment) => {
//   //       const first = a[
//   //         sortDescriptor.column as keyof MedicalAppointment
//   //       ] as unknown as number;
//   //       const second = b[
//   //         sortDescriptor.column as keyof MedicalAppointment
//   //       ] as unknown as number;
//   //       const cmp = first < second ? -1 : first > second ? 1 : 0;

//   //       console.log({ a, b });

//   //       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//   //     }
//   //   );
//   // }, [appointments, sortDescriptor]);

//   return (
//     <>
//       <pre>
//         {isLoadingAppointments
//           ? "Cargando..."
//           : JSON.stringify(appointments, null, 2)}
//       </pre>

//       {/* <Table
//         aria-label="Example table with custom cells, pagination and sorting"
//         isHeaderSticky
//         // bottomContent={bottomContent}
//         bottomContentPlacement="outside"
//         classNames={{
//           wrapper: "max-h-[382px]",
//         }}
//         // selectedKeys={selectedKeys}
//         // selectionMode="multiple"
//         // sortDescriptor={sortDescriptor}
//         // topContent={topContent}
//         topContentPlacement="outside"
//         // onSelectionChange={setSelectedKeys}
//         // onSortChange={setSortDescriptor}
//       >
//         <TableHeader columns={headerColumns}>
//           {(column) => (
//             <TableColumn
//               key={column.uid}
//               align={column.uid === "actions" ? "center" : "start"}
//               allowsSorting={column.sortable}
//             >
//               {column.name}
//             </TableColumn>
//           )}
//         </TableHeader>
//         <TableBody emptyContent={"No hay citas"} items={sortedItems}>
//           {(item) => (
//             <TableRow key={item.id}>{(columnKey) => <TableCell />}</TableRow>
//           )}
//         </TableBody>
//       </Table> */}

//       <Table aria-label="Example empty table">
//         <TableHeader>
//           {[
//             {
//               key: "id",
//               label: "test",
//             },
//           ].map((column) => (
//             <TableColumn key={column.key}>{column.label}</TableColumn>
//           ))}
//           {/* <TableColumn>STATUS</TableColumn> */}
//         </TableHeader>
//         <TableBody>
//           {[
//             {
//               key: "id",
//             },
//           ].map((row) => (
//             <TableRow key={row.key}>{(columnKey) => <TableCell />}</TableRow>
//           ))}
//         </TableBody>
//         {/* <TableBody emptyContent={"No rows to display."}>{[]}</TableBody> */}
//       </Table>
//     </>
//   );
// }

// function TableCell() {
//   return <NextuiTableCell>{"1"}</NextuiTableCell>;
// }

// ----------------------------------------------------------------------

// import React from "react";

// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   getKeyValue,
// } from "@nextui-org/react";

// const rows = [
//   {
//     key: "1",
//     name: "Tony Reichert",
//     role: "CEO",
//     status: "Active",
//   },
//   {
//     key: "2",
//     name: "Zoey Lang",
//     role: "Technical Lead",
//     status: "Paused",
//   },
//   {
//     key: "3",
//     name: "Jane Fisher",
//     role: "Senior Developer",
//     status: "Active",
//   },
//   {
//     key: "4",
//     name: "William Howard",
//     role: "Community Manager",
//     status: "Vacation",
//   },
// ];

// const columns = [
//   {
//     key: "name",
//     label: "NAME",
//   },
//   {
//     key: "role",
//     label: "ROLE",
//   },
//   {
//     key: "status",
//     label: "STATUS",
//   },
// ];

// export default function App() {
//   return (
//     <Table aria-label="Example table with dynamic content">
//       <TableHeader columns={columns}>
//         {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
//       </TableHeader>
//       <TableBody items={rows}>
//         {(item) => (
//           <TableRow key={item.key}>
//             {(columnKey) => <TableCell>{"a"}</TableCell>}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }

// ----------------------------------------------------------------------

// import React from "react";

// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Input,
//   Button,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Chip,
//   User,
//   Pagination,
//   Selection,
//   ChipProps,
//   SortDescriptor,
// } from "@nextui-org/react";

// import { columns, users, statusOptions } from "./data";
// import { capitalize } from "./utils";

// const statusColorMap: Record<string, ChipProps["color"]> = {
//   active: "success",
//   paused: "danger",
//   vacation: "warning",
// };

// const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

// type User = (typeof users)[0];

// export default function App() {
//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
//     new Set([])
//   );
//   const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
//     new Set(INITIAL_VISIBLE_COLUMNS)
//   );
//   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
//     column: "age",
//     direction: "ascending",
//   });

//   const [page, setPage] = React.useState(1);

//   const hasSearchFilter = Boolean(filterValue);

//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return columns;

//     return columns.filter((column) =>
//       Array.from(visibleColumns).includes(column.uid)
//     );
//   }, [visibleColumns]);

//   const filteredItems = React.useMemo(() => {
//     let filteredUsers = [...users];

//     if (hasSearchFilter) {
//       filteredUsers = filteredUsers.filter((user) =>
//         user.name.toLowerCase().includes(filterValue.toLowerCase())
//       );
//     }
//     if (
//       statusFilter !== "all" &&
//       Array.from(statusFilter).length !== statusOptions.length
//     ) {
//       filteredUsers = filteredUsers.filter((user) =>
//         Array.from(statusFilter).includes(user.status)
//       );
//     }

//     return filteredUsers;
//   }, [users, filterValue, statusFilter]);

//   const pages = Math.ceil(filteredItems.length / rowsPerPage);

//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);
//   }, [page, filteredItems, rowsPerPage]);

//   const sortedItems = React.useMemo(() => {
//     return [...items].sort((a: User, b: User) => {
//       const first = a[sortDescriptor.column as keyof User] as number;
//       const second = b[sortDescriptor.column as keyof User] as number;
//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
//     const cellValue = user[columnKey as keyof User];

//     switch (columnKey) {
//       case "name":
//         return (
//           <User
//             avatarProps={{ radius: "lg", src: user.avatar }}
//             description={user.email}
//             name={cellValue}
//           >
//             {user.email}
//           </User>
//         );
//       case "role":
//         return (
//           <div className="flex flex-col">
//             <p className="text-bold text-small capitalize">{cellValue}</p>
//             <p className="text-bold text-tiny capitalize text-default-400">
//               {user.team}
//             </p>
//           </div>
//         );
//       case "status":
//         return (
//           <Chip
//             className="capitalize"
//             color={statusColorMap[user.status]}
//             size="sm"
//             variant="flat"
//           >
//             {cellValue}
//           </Chip>
//         );
//       case "actions":
//         return (
//           <div className="relative flex justify-end items-center gap-2">
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button isIconOnly size="sm" variant="light">
//                   {/* <VerticalDotsIcon className="text-default-300" /> */}
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu>
//                 <DropdownItem>View</DropdownItem>
//                 <DropdownItem>Edit</DropdownItem>
//                 <DropdownItem>Delete</DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         );
//       default:
//         return cellValue;
//     }
//   }, []);

//   const onNextPage = React.useCallback(() => {
//     if (page < pages) {
//       setPage(page + 1);
//     }
//   }, [page, pages]);

//   const onPreviousPage = React.useCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   }, [page]);

//   const onRowsPerPageChange = React.useCallback(
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       setRowsPerPage(Number(e.target.value));
//       setPage(1);
//     },
//     []
//   );

//   const onSearchChange = React.useCallback((value?: string) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   const onClear = React.useCallback(() => {
//     setFilterValue("");
//     setPage(1);
//   }, []);

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-3 items-end">
//           <Input
//             isClearable
//             className="w-full sm:max-w-[44%]"
//             placeholder="Search by name..."
//             // startContent={<SearchIcon />}
//             value={filterValue}
//             onClear={() => onClear()}
//             onValueChange={onSearchChange}
//           />
//           <div className="flex gap-3">
//             <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button
//                   // endContent={<ChevronDownIcon className="text-small" />}
//                   variant="flat"
//                 >
//                   Status
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Table Columns"
//                 closeOnSelect={false}
//                 selectedKeys={statusFilter}
//                 selectionMode="multiple"
//                 onSelectionChange={setStatusFilter}
//               >
//                 {statusOptions.map((status) => (
//                   <DropdownItem key={status.uid} className="capitalize">
//                     {capitalize(status.name)}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//             <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button
//                   // endContent={<ChevronDownIcon className="text-small" />}
//                   variant="flat"
//                 >
//                   Columns
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Table Columns"
//                 closeOnSelect={false}
//                 selectedKeys={visibleColumns}
//                 selectionMode="multiple"
//                 onSelectionChange={setVisibleColumns}
//               >
//                 {columns.map((column) => (
//                   <DropdownItem key={column.uid} className="capitalize">
//                     {capitalize(column.name)}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//             <Button
//               color="primary"
//               // endContent={<PlusIcon />}
//             >
//               Add New
//             </Button>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-default-400 text-small">
//             Total {users.length} users
//           </span>
//           <label className="flex items-center text-default-400 text-small">
//             Rows per page:
//             <select
//               className="bg-transparent outline-none text-default-400 text-small"
//               onChange={onRowsPerPageChange}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="15">15</option>
//             </select>
//           </label>
//         </div>
//       </div>
//     );
//   }, [
//     filterValue,
//     statusFilter,
//     visibleColumns,
//     onSearchChange,
//     onRowsPerPageChange,
//     users.length,
//     hasSearchFilter,
//   ]);

//   const bottomContent = React.useMemo(() => {
//     return (
//       <div className="py-2 px-2 flex justify-between items-center">
//         <span className="w-[30%] text-small text-default-400">
//           {selectedKeys === "all"
//             ? "All items selected"
//             : `${selectedKeys.size} of ${filteredItems.length} selected`}
//         </span>
//         <Pagination
//           isCompact
//           showControls
//           showShadow
//           color="primary"
//           page={page}
//           total={pages}
//           onChange={setPage}
//         />
//         <div className="hidden sm:flex w-[30%] justify-end gap-2">
//           <Button
//             isDisabled={pages === 1}
//             size="sm"
//             variant="flat"
//             onPress={onPreviousPage}
//           >
//             Previous
//           </Button>
//           <Button
//             isDisabled={pages === 1}
//             size="sm"
//             variant="flat"
//             onPress={onNextPage}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     );
//   }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

//   return (
//     <Table
//       aria-label="Example table with custom cells, pagination and sorting"
//       isHeaderSticky
//       bottomContent={bottomContent}
//       bottomContentPlacement="outside"
//       classNames={{
//         wrapper: "max-h-[382px]",
//       }}
//       selectedKeys={selectedKeys}
//       selectionMode="multiple"
//       sortDescriptor={sortDescriptor}
//       topContent={topContent}
//       topContentPlacement="outside"
//       onSelectionChange={setSelectedKeys}
//       onSortChange={setSortDescriptor}
//     >
//       <TableHeader columns={headerColumns}>
//         {(column) => (
//           <TableColumn
//             key={column.uid}
//             align={column.uid === "actions" ? "center" : "start"}
//             allowsSorting={column.sortable}
//           >
//             {column.name}
//           </TableColumn>
//         )}
//       </TableHeader>
//       <TableBody emptyContent={"No users found"} items={sortedItems}>
//         {(item) => (
//           <TableRow key={item.id}>
//             {(columnKey) => (
//               <TableCell>{renderCell(item, columnKey)}</TableCell>
//             )}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }

import React from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
  Button,
} from "@nextui-org/react";
import useSWR from "swr";
import { MedicalAppointment } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

const columnsPatient = [
  {
    key: "date",
    label: "FECHA",
  },
  {
    key: "doctor.name",
    label: "DOCTOR",
  },
  {
    key: "doctor.center.name",
    label: "CENTRO",
  },

  {
    key: "doctor.center.department",
    label: "DEPARTAMENTO",
  },

  {
    key: "doctor.center.city",
    label: "CIUDAD",
  },

  {
    key: "doctor.center.address",
    label: "DIRECCIÓN",
  },

  {
    key: "doctor.center.phone",
    label: "TELÉFONO",
  },

  {
    key: "status",
    label: "ESTADO",
  },
];

const columnsDoctor = [
  {
    key: "date",
    label: "FECHA",
  },
  {
    key: "patient.name",
    label: "PACIENTE",
  },
  {
    key: "patient.email",
    label: "CORREO ELECTRÓNICO",
  },
  {
    key: "status",
    label: "ESTADO",
  },
];

export default function MedicalAppointment() {
  const { data: session, status } = useSession();

  const { data: appointments, isLoading: isLoadingAppointments } = useSWR<
    MedicalAppointment[]
  >("/api/appointment/self", fetcher());

  return (
    <>
      <Table
        aria-label="Tabla de mis citas"
        topContent={
          <>
            <div className="flex gap-4 justify-between ">
              <h2 className="text-md">Mis citas</h2>

              {session?.user.role === "PATIENT" && (
                <Tooltip content="Agendar cita" color="primary">
                  <Button
                    as={Link}
                    href="/#appointment"
                    isIconOnly
                    aria-label="Agendar cita"
                    variant="flat"
                    color="primary"
                  >
                    <PlusCircleIcon className="w-6" />
                  </Button>
                </Tooltip>
              )}
            </div>
          </>
        }
      >
        <TableHeader
          columns={
            session?.user.role === "PATIENT" ? columnsPatient : columnsDoctor
          }
        >
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={appointments || []}
          isLoading={isLoadingAppointments}
          loadingContent={<Spinner />}
          emptyContent={"No hay citas"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    return prev[curr];
  }, item);
}
