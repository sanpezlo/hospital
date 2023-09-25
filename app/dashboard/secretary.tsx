"use client";

import { fetcher } from "@/lib/fetcher";
import {
  Input,
  Button,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { Center } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import Sure from "@/app/dashboard/sure";

export default function Secretary() {
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

  const { data: centers, isLoading } = useSWR<Center[]>(
    "/api/center",
    fetcher()
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async () => {
    const response = await fetch("/api/user/secretary", {
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
          placeholder="Seleccione un centro"
          selectedKeys={new Set(data.centerId ? [data.centerId] : [])}
          onSelectionChange={(value) => {
            setErrors((prev) => ({ ...prev, centerId: "" }));
            if (value !== "all")
              setData({ ...data, centerId: value.values().next().value });
          }}
          isLoading={isLoading}
          isDisabled={(centers || []).length === 0}
          isInvalid={Boolean(errors.centerId)}
          errorMessage={errors.centerId}
        >
          {(centers || []).map((center) => (
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
            Crear Secreatria
          </Button>
        </div>
      </form>
      <Sure
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onPress={handleSubmit}
        entity="Secretaria"
        list={{
          Nombre: data.name,
          "Correo electrónico": data.email,
          Contraseña: "secretary",
          "Nombre del centro":
            centers?.find((center) => center.id === data.centerId)?.name || "",
        }}
      />
    </>
  );
}
