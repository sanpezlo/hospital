"use client";

import { fetcher } from "@/lib/fetcher";
import { Department } from "@/types/departments";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";

export default function Center() {
  const [data, setData] = useState({
    name: "",
    address: "",
    department: "",
    city: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    department: "",
    city: "",
    phone: "",
    email: "",
  });

  const { data: departments, isLoading: isLoadingDepartments } = useSWR<
    Department[]
  >("/api/department", fetcher());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
        address: "",
        department: "",
        city: "",
        phone: "",
        email: "",
      });
    } else if (response.status === 400) {
      if (body.error.error) {
        Object.keys(body.error.error).forEach((key) => {
          if (key === "_errors") return;
          setErrors((prev) => ({
            ...prev,
            [key]: body.error.error[key]._errors[0],
          }));
        });
      } else {
        setErrors((prev) => ({ ...prev, name: body.error.message }));
      }
    } else {
      console.log({ response, body });
    }
  };

  return (
    <form id="center" className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        isRequired
        label="Nombre"
        placeholder="Ingrese el nombre"
        type="text"
        value={data.name}
        onChange={(e) => {
          setErrors((prev) => ({ ...prev, name: "" }));
          setData({ ...data, name: e.target.value });
        }}
        isInvalid={Boolean(errors.name)}
        errorMessage={errors.name}
      />

      <Select
        isRequired
        label="Departamento"
        placeholder="Seleccione un departamento"
        selectedKeys={new Set(data.department ? [data.department] : [])}
        onSelectionChange={(value) => {
          setErrors((prev) => ({ ...prev, departmentId: "" }));
          if (value !== "all")
            setData({
              ...data,
              department: value.values().next().value,
              city: "",
            });
        }}
        isLoading={isLoadingDepartments}
        isDisabled={(departments || []).length === 0}
        errorMessage={
          errors.department
            ? errors.department
            : !isLoadingDepartments &&
              (departments || []).length === 0 &&
              "No hay departamentos registrados"
        }
        isInvalid={Boolean(errors.department)}
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
        selectedKeys={new Set(data.city ? [data.city] : [])}
        onSelectionChange={(value) => {
          setErrors((prev) => ({ ...prev, city: "" }));
          if (value !== "all")
            setData({ ...data, city: value.values().next().value });
        }}
        isDisabled={
          !data.department ||
          (
            departments?.find(({ name }) => name === data.department)?.cities ||
            []
          ).length === 0
        }
        errorMessage={
          errors.department
            ? errors.department
            : Boolean(data.department) &&
              (
                departments?.find(({ name }) => name === data.department)
                  ?.cities || []
              ).length === 0 &&
              "No hay ciudades registradas"
        }
        isInvalid={Boolean(errors.city)}
      >
        {(
          departments?.find(({ name }) => name === data.department)?.cities ||
          []
        ).map((city) => (
          <SelectItem key={city.name} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </Select>

      <Input
        isRequired
        label="Dirección"
        placeholder="Ingrese la dirección"
        type="text"
        value={data.address}
        onChange={(e) => {
          setErrors((prev) => ({ ...prev, address: "" }));
          setData({ ...data, address: e.target.value });
        }}
        isInvalid={Boolean(errors.address)}
        errorMessage={errors.address}
      />

      <Input
        isRequired
        type="text"
        label="Teléfono"
        placeholder="Ingrese el teléfono"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">+57</span>
          </div>
        }
        value={data.phone}
        onChange={(e) => {
          setErrors((prev) => ({ ...prev, phone: "" }));
          setData({ ...data, phone: e.target.value });
        }}
        isInvalid={Boolean(errors.phone)}
        errorMessage={errors.phone}
      />
      <Input
        isRequired
        label="Correo electrónico"
        placeholder="Ingrese el correo electrónico"
        type="email"
        labelPlacement="inside"
        value={data.email}
        onChange={(e) => {
          setErrors((prev) => ({ ...prev, email: "" }));
          setData({ ...data, email: e.target.value });
        }}
        isInvalid={Boolean(errors.email)}
        errorMessage={errors.email}
      />

      <div className="flex gap-2 justify-end">
        <Button
          fullWidth
          color="primary"
          type="submit"
          isDisabled={
            !data.name ||
            !data.address ||
            !data.department ||
            !data.city ||
            !data.phone ||
            !data.email ||
            Boolean(errors.name) ||
            Boolean(errors.address) ||
            Boolean(errors.department) ||
            Boolean(errors.city) ||
            Boolean(errors.phone) ||
            Boolean(errors.email)
          }
        >
          Crear Centro
        </Button>
      </div>
    </form>
  );
}
