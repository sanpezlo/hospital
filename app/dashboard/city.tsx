"use client";

import { fetcher } from "@/lib/fetcher";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Department } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

export default function City() {
  const [data, setData] = useState({
    name: "",
    departmentId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    departmentId: "",
  });

  const { data: departments, isLoading } = useSWR<Department[]>(
    "/api/department",
    fetcher()
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
        departmentId: "",
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Select
        isRequired
        label="Departamento"
        placeholder="Seleccione un departamento"
        selectedKeys={new Set(data.departmentId ? [data.departmentId] : [])}
        onSelectionChange={(value) => {
          setErrors((prev) => ({ ...prev, departmentId: "", name: "" }));
          if (value !== "all")
            setData({ ...data, departmentId: value.values().next().value });
        }}
        isLoading={isLoading}
        isDisabled={(departments || []).length === 0}
        errorMessage={
          !isLoading && (departments || []).length === 0
            ? "No hay departamentos registrados"
            : errors.departmentId
        }
        isInvalid={Boolean(errors.departmentId)}
      >
        {(departments || []).map((department) => (
          <SelectItem key={department.id} value={department.name}>
            {department.name}
          </SelectItem>
        ))}
      </Select>

      <Input
        isRequired
        label="Nombre"
        placeholder="Ingrese el de la ciudad"
        type="text"
        value={data.name}
        onChange={(e) => {
          setErrors((prev) => ({ ...prev, name: "" }));
          setData({ ...data, name: e.target.value });
        }}
        isInvalid={Boolean(errors.name)}
        errorMessage={errors.name}
      />

      <div className="flex gap-2 justify-end">
        <Button
          fullWidth
          color="primary"
          type="submit"
          isDisabled={
            !data.name ||
            !data.departmentId ||
            Boolean(errors.name) ||
            Boolean(errors.departmentId)
          }
        >
          Crear Ciudad
        </Button>
      </div>
    </form>
  );
}
