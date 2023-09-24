"use client";

import { Input, Button } from "@nextui-org/react";
import { useState } from "react";

export default function Admin() {
  const [data, setData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/user/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
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
        setErrors((prev) => ({ ...prev, email: body.error.message }));
      }
    } else {
      console.log({ response, body });
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

      <div className="flex gap-2 justify-end">
        <Button
          fullWidth
          color="primary"
          type="submit"
          isDisabled={
            !data.name ||
            !data.email ||
            Boolean(errors.name) ||
            Boolean(errors.email)
          }
        >
          Crear Admin
        </Button>
      </div>
    </form>
  );
}
