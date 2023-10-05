"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Tooltip,
  VisuallyHidden,
  useSwitch,
} from "@nextui-org/react";
import { Center } from "@prisma/client";
import { useState } from "react";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Department } from "@/types/departments";

export default function BasicInformation({ center }: { center: Center }) {
  const { data: departments, isLoading: isLoadingDepartments } = useSWR<
    Department[]
  >("/api/department", fetcher());

  return (
    <>
      <Card className="max-w-full">
        <CardHeader className="flex gap-4 justify-between">
          <h2 className="text-md">Información básica</h2>
        </CardHeader>
        <Divider />
        <CardBody className="overflow-hidden">
          <form className="flex flex-col gap-4">
            <Input
              isDisabled={true}
              isRequired
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={center.name}
            />

            <Select
              isRequired
              label="Departamento"
              placeholder="Seleccione un departamento"
              selectedKeys={
                new Set(center.department ? [center.department] : [])
              }
              isLoading={isLoadingDepartments}
              isDisabled={true}
            >
              {(departments || []).map((department) => (
                <SelectItem key={department.name} value={department.name}>
                  {department.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Ciudad"
              placeholder="Seleccione una ciudad"
              isLoading={isLoadingDepartments}
              selectedKeys={new Set(center.city ? [center.city] : [])}
              isDisabled={true}
            >
              {(
                departments?.find(({ name }) => name === center.department)
                  ?.cities || []
              ).map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              isDisabled={true}
              isRequired
              label="Dirección"
              placeholder="Ingrese la dirección"
              type="text"
              value={center.address}
            />

            <Input
              isDisabled={true}
              isRequired
              type="text"
              label="Teléfono"
              placeholder="Ingrese el teléfono"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">+57</span>
                </div>
              }
              value={center.phone}
            />
            <Input
              isDisabled={true}
              isRequired
              label="Correo electrónico"
              placeholder="Ingrese el correo electrónico"
              type="email"
              labelPlacement="inside"
              value={center.email}
            />

            {/* {(session?.user.role === "DOCTOR" ||
              session?.user.role === "DIRECTOR") && (
              <Input
                label="Especialidad"
                placeholder="Ingrese su especialidad"
                value={session?.user.specialization || ""}
                isDisabled={true}={true}
              />
            )} */}
          </form>
        </CardBody>
      </Card>
    </>
  );
}
