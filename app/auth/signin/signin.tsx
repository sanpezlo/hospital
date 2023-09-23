"use client";

import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
}
