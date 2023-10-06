"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Tooltip,
  VisuallyHidden,
  useSwitch,
} from "@nextui-org/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { User } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export default function BasicInformation({
  user,
  isEditable = false,
}: {
  user: User;
  isEditable?: boolean;
}) {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch();

  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    specialization: user.specialization,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    specialization: "",
  });

  const { data: specializations, isLoading: isLoadingSpecialization } = useSWR<
    string[]
  >("/api/specialization", fetcher());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/user/" + user.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        user.role === "DOCTOR" || user.role === "DIRECTOR"
          ? {
              name: data.name,
              email: data.email,
              specialization: data.specialization,
            }
          : {
              name: data.name,
              email: data.email,
            }
      ),
    });

    const body = await response.json();

    if (response.ok) {
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
    <>
      <Card className="max-w-full">
        <CardHeader className="flex gap-4 justify-between">
          <h2 className="text-md">Información básica</h2>
          {isEditable && (
            <div className="flex flex-col gap-2">
              <Tooltip
                content={
                  isSelected ? "Deshabilitar edición" : "Habilitar edición"
                }
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
          )}
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

            {(user.role === "DOCTOR" || user.role === "DIRECTOR") && (
              <Select
                isRequired
                label="Especialización"
                placeholder="Seleccione su especialización"
                selectedKeys={
                  new Set(data.specialization ? [data.specialization] : [])
                }
                onSelectionChange={(value) => {
                  setErrors((prev) => ({ ...prev, specialization: "" }));
                  if (value !== "all") {
                    const specialization = value.values().next().value;
                    if (specialization)
                      setData({
                        ...data,
                        specialization: specialization,
                      });
                  }
                }}
                isLoading={isLoadingSpecialization}
                isDisabled={!isSelected || (specializations || []).length === 0}
                errorMessage={
                  errors.specialization
                    ? errors.specialization
                    : !isLoadingSpecialization &&
                      (specializations || []).length === 0 &&
                      "No hay especializaciónes registradas"
                }
                isInvalid={Boolean(errors.specialization)}
              >
                {(specializations || []).map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
                  </SelectItem>
                ))}
              </Select>
            )}

            <div className="flex gap-2 justify-end">
              {isSelected && (
                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  isDisabled={
                    user.role === "DIRECTOR" || user.role === "DOCTOR"
                      ? !data.name ||
                        !data.email ||
                        !data.specialization ||
                        Boolean(errors.name) ||
                        Boolean(errors.email) ||
                        Boolean(errors.specialization)
                      : !data.name ||
                        !data.email ||
                        Boolean(errors.name) ||
                        Boolean(errors.email)
                  }
                >
                  Editar
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
