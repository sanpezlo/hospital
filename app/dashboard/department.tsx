"use client";

import { Input, Button } from "@nextui-org/react";
import { useState } from "react";

export default function Department() {
  const [data, setData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/department", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
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
      <Input
        isRequired
        label="Nombre"
        placeholder="Ingrese el nombre del departamento"
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
          isDisabled={!data.name || Boolean(errors.name)}
        >
          Crear Departamento
        </Button>
      </div>
    </form>
  );
}
