"use client";

import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/user/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Paciente creado correctamente");
      setData({
        name: "",
        email: "",
        password: "",
      });
      router.push("/auth/login");
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

      <Input
        isRequired
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        type={isVisible ? "text" : "password"}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <EyeSlashIcon className="text-default-400 pointer-events-none w-6" />
            ) : (
              <EyeIcon className="text-default-400 pointer-events-none w-6" />
            )}
          </button>
        }
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit">
          Registrar
        </Button>
      </div>
    </form>
  );
}
