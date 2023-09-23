"use client";

import { fetcher } from "@/lib/fetcher";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { type Center } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

export default function Director() {
  const [data, setData] = useState({
    name: "",
    email: "",
    centerId: "",
  });

  const { data: centersAvailable, isLoading } = useSWR<Center[]>(
    "/api/center/available",
    fetcher()
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/user/director", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Director creado correctamente");
      setData({
        name: "",
        email: "",
        centerId: "",
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        isRequired
        label="Nombre"
        placeholder="Ingrese su nombre"
        type="text"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <Input
        isRequired
        label="Correo electrónico"
        placeholder="Ingrese su correo electrónico"
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <Select
        isRequired
        label="Centro"
        placeholder="Seleccione un centro disponible"
        selectedKeys={new Set(data.centerId ? [data.centerId] : [])}
        onSelectionChange={(value) => {
          if (value !== "all")
            setData({ ...data, centerId: value.values().next().value });
        }}
        isDisabled={isLoading || centersAvailable?.length === 0}
      >
        {(centersAvailable || []).map((center) => (
          <SelectItem key={center.id} value={center.name}>
            {center.name}
          </SelectItem>
        ))}
      </Select>

      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit">
          Crear Director
        </Button>
      </div>
    </form>
  );
}
