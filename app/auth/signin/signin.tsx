"use client";

import { Input, Button, Link } from "@nextui-org/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import NextLink from "next/link";

export default function SignIn({ isError = false }: { isError?: boolean }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(isError);
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
        onChange={(e) => {
          setError(false);
          setData({ ...data, email: e.target.value });
        }}
        isInvalid={error}
        errorMessage={error && "Correo electrónico o contraseña incorrectos"}
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
        onChange={(e) => {
          setError(false);
          setData({ ...data, password: e.target.value });
        }}
        isInvalid={error}
      />

      <p className="text-center text-small">
        ¿No tienes una cuenta?{" "}
        <Link as={NextLink} size="sm" href="/auth/signup">
          Regístrate
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button
          fullWidth
          color="primary"
          type="submit"
          isDisabled={!data.email || !data.password || Boolean(error)}
        >
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
}
