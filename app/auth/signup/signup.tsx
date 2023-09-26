"use client";

import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import NextLink from "next/link";

export default function SignUp() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/user/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
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
          setErrors((prev) => ({ ...prev, password: "" }));
          setData({ ...data, password: e.target.value });
        }}
        isInvalid={Boolean(errors.password)}
        errorMessage={errors.password}
      />

      <p className="text-center text-small">
        ¿Ya tienes una cuenta?{" "}
        <Link as={NextLink} size="sm" href="/auth/signin">
          Inicia sesión
        </Link>
      </p>

      <div className="flex gap-4 flex-col">
        <Checkbox
          isRequired
          isSelected={isSelected}
          onValueChange={setIsSelected}
        >
          Acepto los términos y condiciones
        </Checkbox>
        <Button
          fullWidth
          color="primary"
          type="submit"
          isDisabled={
            !data.name ||
            !data.email ||
            !data.password ||
            !isSelected ||
            Boolean(errors.name) ||
            Boolean(errors.email) ||
            Boolean(errors.password)
          }
        >
          Registrar
        </Button>
      </div>
    </form>
  );
}
