"use client";

import { fetcher } from "@/lib/fetcher";
import {
  Input,
  Button,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { type Center } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import Sure from "@/app/dashboard/sure";

export default function Director() {
  const [data, setData] = useState({
    name: "",
    email: "",
    centerId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    centerId: "",
  });

  const {
    data: centersAvailable,
    isLoading,
    error,
  } = useSWR<Center[]>("/api/center/available", fetcher(), {
    shouldRetryOnError: false,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async () => {
    const response = await fetch("/api/user/director", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
        email: "",
        centerId: "",
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
        setErrors((prev) => ({ ...prev, email: body.error.message }));
      }
    } else {
      console.log({ response, body });
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        <Input
          isRequired
          label="Nombre"
          placeholder="Ingrese su nombre"
          type="text"
          value={data.name}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, name: "" }));
            setData({ ...data, name: e.target.value });
          }}
          isInvalid={Boolean(errors.name)}
          errorMessage={errors.name}
        />
        <Input
          isRequired
          label="Correo electrónico"
          placeholder="Ingrese su correo electrónico"
          type="email"
          value={data.email}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, email: "" }));
            setData({ ...data, email: e.target.value });
          }}
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email}
        />

        <Select
          isRequired
          label="Centro"
          placeholder="Seleccione un centro disponible"
          selectedKeys={new Set(data.centerId ? [data.centerId] : [])}
          onSelectionChange={(value) => {
            setErrors((prev) => ({ ...prev, centerId: "" }));
            if (value !== "all")
              setData({ ...data, centerId: value.values().next().value });
          }}
          isLoading={isLoading}
          isDisabled={(centersAvailable || []).length === 0}
          errorMessage={
            !isLoading && (centersAvailable || []).length === 0
              ? "No hay centros disponibles"
              : errors.centerId
          }
          isInvalid={Boolean(errors.centerId)}
        >
          {(centersAvailable || []).map((center) => (
            <SelectItem key={center.id} value={center.name}>
              {center.name}
            </SelectItem>
          ))}
        </Select>

        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            color="primary"
            type="submit"
            isDisabled={
              !data.name ||
              !data.email ||
              !data.centerId ||
              Boolean(errors.name) ||
              Boolean(errors.email) ||
              Boolean(errors.centerId)
            }
          >
            Crear Director
          </Button>
        </div>
      </form>
      <Sure
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onPress={handleSubmit}
        entity="Director"
        list={{
          Nombre: data.name,
          "Correo electrónico": data.email,
          Contraseña: "director",
          "Nombre del centro":
            centersAvailable?.find((center) => center.id === data.centerId)
              ?.name || "",
        }}
      />
    </>
  );
}
