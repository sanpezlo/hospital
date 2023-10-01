"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  SwitchProps,
  Tooltip,
  VisuallyHidden,
  useSwitch,
} from "@nextui-org/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function BasicInformation() {
  const { data: session, status, update } = useSession();

  console.log({ session, status });

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch();

  const [data, setData] = useState({
    name: session?.user.name,
    email: session?.user.email,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (status === "authenticated")
      setData({
        name: session?.user.name,
        email: session?.user.email,
      });
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/user/self", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
        },
      });

      getInputProps().onChange?.(e as any);
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
    <Card className="max-w-full">
      <CardHeader className="flex gap-4 justify-between">
        <h2 className="text-md">Información básica</h2>
        <div className="flex flex-col gap-2">
          <Tooltip
            content={isSelected ? "Deshabilitar edición" : "Habilitar edición"}
            color={isSelected ? "primary" : "default"}
          >
            <Component {...getBaseProps()}>
              <VisuallyHidden>
                <input {...getInputProps()} />
              </VisuallyHidden>
              <div
                {...getWrapperProps()}
                className={slots.wrapper({
                  className: [
                    "w-8 h-8",
                    "flex items-center justify-center",
                    "rounded-lg bg-default-100 hover:bg-default-200",
                  ],
                })}
              >
                <PencilIcon className="w-4" />
              </div>
            </Component>
          </Tooltip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="overflow-hidden">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            placeholder="Ingrese su nombre"
            value={data.name || ""}
            isDisabled={!isSelected}
            onChange={(e) => {
              setErrors((prev) => ({ ...prev, name: "" }));
              setData((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          <Input
            label="Correo electrónico"
            placeholder="Ingrese su correo electrónico"
            value={data.email || ""}
            isDisabled={!isSelected}
            onChange={(e) => {
              setErrors((prev) => ({ ...prev, email: "" }));
              setData({ ...data, email: e.target.value });
            }}
          />

          {(session?.user.role === "DOCTOR" ||
            session?.user.role === "DIRECTOR") && (
            <Input
              label="Especialidad"
              placeholder="Ingrese su especialidad"
              value={session?.user.specialization || ""}
              isDisabled={true}
            />
          )}

          {isSelected && (
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
                Editar
              </Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
