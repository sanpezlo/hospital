"use client";

import { Input, Button } from "@nextui-org/react";
import { useState } from "react";

export default function Center() {
  const [data, setData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Centro creado correctamente");
      setData({
        name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        isRequired
        label="Nombre"
        placeholder="Ingrese el nombre"
        type="text"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <Input
        isRequired
        label="Direccion"
        placeholder="Ingrese la direccion"
        type="text"
        value={data.address}
        onChange={(e) => setData({ ...data, address: e.target.value })}
      />
      <Input
        isRequired
        label="Ciudad"
        placeholder="Ingrese la ciudad"
        type="text"
        value={data.city}
        onChange={(e) => setData({ ...data, city: e.target.value })}
      />
      <Input
        isRequired
        type="text"
        label="Telefono"
        placeholder="Ingrese el telefono"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">+57</span>
          </div>
        }
        value={data.phone}
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />
      <Input
        isRequired
        label="Correo electrónico"
        placeholder="Ingrese el correo electrónico"
        type="email"
        labelPlacement="inside"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit">
          Crear Centro
        </Button>
      </div>
    </form>
  );
}
