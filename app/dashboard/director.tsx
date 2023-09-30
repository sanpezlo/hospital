"use client";

import { fetcher } from "@/lib/fetcher";
import {
  Input,
  Button,
  Select,
  SelectItem,
  useDisclosure,
  Chip,
  Card,
  CardBody,
  Tooltip,
  CardHeader,
} from "@nextui-org/react";
import { type Center } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import Sure from "@/app/dashboard/sure";
import Schedule from "@/app/dashboard/schedule";
import { CreateUser } from "@/types/user";
import { standardTime } from "@/lib/parse";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

export default function Director() {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    specialization: "",
    schedules: "",
    centerId: "",
  });

  const { data: centersAvailable, isLoading } = useSWR<Center[]>(
    "/api/center/available",
    fetcher(),
    {
      shouldRetryOnError: false,
    }
  );

  const { data: specializations, isLoading: isLoadingSpecialization } = useSWR<
    string[]
  >("/api/specialization", fetcher());

  const [data, setData] = useState<CreateUser>({
    name: "",
    email: "",
    specialization: "Ninguna",
    schedules: [],
    centerId: "",
  });

  const {
    isOpen: isOpenSure,
    onOpen: onOpenSure,
    onOpenChange: onOpenChangeSure,
  } = useDisclosure();

  const {
    isOpen: isOpenSchedule,
    onOpen: onOpenSchedule,
    onOpenChange: onOpenChangeSchedule,
  } = useDisclosure();

  const handleSubmit = async () => {
    const response = await fetch("/api/user/director", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
        email: "",
        specialization: "Ninguna",
        schedules: [],
        centerId: "",
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
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onOpenSure();
        }}
      >
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
          isDisabled={(specializations || []).length === 0}
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
        <Select
          isRequired
          label="Centro"
          placeholder="Seleccione un centro disponible"
          selectedKeys={new Set(data.centerId ? [data.centerId] : [])}
          onSelectionChange={(value) => {
            setErrors((prev) => ({ ...prev, centerId: "" }));
            if (value !== "all")
              setData({ ...data, centerId: value.values().next().value });
          }}
          isLoading={isLoading}
          isDisabled={(centersAvailable || []).length === 0}
          errorMessage={
            errors.centerId
              ? errors.centerId
              : !isLoading &&
                (centersAvailable || []).length === 0 &&
                "No hay centros disponibles"
          }
          isInvalid={Boolean(errors.centerId)}
        >
          {(centersAvailable || []).map((center) => (
            <SelectItem key={center.id} value={center.name}>
              {center.name}
            </SelectItem>
          ))}
        </Select>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            Horarios
            <Tooltip content="Agregar horario">
              <Button
                isIconOnly={true}
                variant="light"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenSchedule();
                }}
                aria-label="Agregar horario"
              >
                <PlusCircleIcon className="w-6" />
              </Button>
            </Tooltip>
          </div>
          {data.schedules.map((schedule, index) => (
            <Card key={index} className="bg-default/40" shadow="none">
              <CardBody className="flex flex-col gap-2 relative">
                <Tooltip content="Eliminar horario" color="danger">
                  <XCircleIcon
                    className="w-6 absolute right-1 top-1 hover:opacity-80 cursor-pointer text-danger"
                    onClick={() => {
                      setData((prev) => {
                        const next = [...prev.schedules];
                        next.splice(index, 1);
                        return { ...prev, schedules: next };
                      });
                    }}
                  />
                </Tooltip>
                <div className="flex gap-2 flex-wrap">
                  Hora:
                  <Chip variant="solid">
                    {standardTime(schedule.startTime)} -{" "}
                    {standardTime(schedule.departureTime)}
                  </Chip>
                </div>
                <div className="flex gap-2 flex-wrap">
                  Dias:
                  {schedule.days.map((day, index) => (
                    <Chip key={`${day}-${index}`} variant="solid">
                      {day}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}

          <Schedule
            isOpen={isOpenSchedule}
            onOpenChange={onOpenChangeSchedule}
            onPress={handleSubmit}
            setData={setData}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            color="primary"
            type="submit"
            isDisabled={
              !data.name ||
              !data.email ||
              !data.specialization ||
              data.schedules.length === 0 ||
              !data.centerId ||
              Boolean(errors.name) ||
              Boolean(errors.email) ||
              Boolean(errors.specialization) ||
              Boolean(errors.schedules) ||
              Boolean(errors.centerId)
            }
          >
            Crear Director
          </Button>
        </div>
      </form>
      <Sure
        isOpen={isOpenSure}
        onOpenChange={onOpenChangeSure}
        onPress={handleSubmit}
        entity="Director"
        list={{
          Nombre: data.name,
          "Correo electrónico": data.email,
          Especialización: data.specialization || "Ninguna",
          Contraseña: "director",
          "Nombre del centro":
            centersAvailable?.find((center) => center.id === data.centerId)
              ?.name || "",
        }}
      />
    </>
  );
}
