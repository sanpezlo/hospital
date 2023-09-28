"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";
import { Center } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const years = [
  new Date().getFullYear().toString(),
  (new Date().getFullYear() + 1).toString(),
];

export default function RequestMedicalAppointment() {
  const { data: session, status } = useSession();

  const [data, setData] = useState({
    centerId: "",
    year: years[0],
    month: "1",
    day: "",
  });

  const [errors, setErrors] = useState({
    centerId: "",
    year: "",
    month: "",
    day: "",
  });

  const { data: centers, isLoading } = useSWR<Center[]>(
    "/api/center",
    fetcher()
  );

  return (
    <Card>
      <CardHeader className="flex gap-4">
        <h3 className="text-md">Agendar cita</h3>
      </CardHeader>
      <Divider />
      <CardBody className="overflow-hidden">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Select
            isRequired
            label="Centro"
            placeholder="Selecciona un centro"
            selectedKeys={new Set(data.centerId ? [data.centerId] : [])}
            onSelectionChange={(value) => {
              setErrors((prev) => ({ ...prev, centerId: "" }));
              if (value !== "all")
                setData({ ...data, centerId: value.values().next().value });
            }}
            isLoading={isLoading}
            isDisabled={(centers || []).length === 0}
            errorMessage={
              errors.centerId
                ? errors.centerId
                : !isLoading &&
                  (centers || []).length === 0 &&
                  "No hay centros disponibles"
            }
            isInvalid={Boolean(errors.centerId)}
          >
            {(centers || []).map((center) => (
              <SelectItem key={center.id} value={center.name}>
                {center.name}
              </SelectItem>
            ))}
          </Select>

          <div className="flex flex-row gap-4">
            <Select
              isRequired
              label="Año"
              selectedKeys={new Set(data.year ? [data.year] : [])}
              onSelectionChange={(value) => {
                setErrors((prev) => ({ ...prev, year: "" }));
                if (value !== "all")
                  setData({
                    ...data,
                    year: value.values().next().value,
                    day: "",
                  });
              }}
              errorMessage={errors.year}
              isInvalid={Boolean(errors.year)}
            >
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Mes"
              selectedKeys={new Set(data.month ? [data.month] : [])}
              onSelectionChange={(value) => {
                setErrors((prev) => ({ ...prev, month: "" }));
                if (value !== "all")
                  setData({
                    ...data,
                    month: value.values().next().value,
                    day: "",
                  });
              }}
              errorMessage={errors.month}
              isInvalid={Boolean(errors.month)}
            >
              {months.map((month, index) => (
                <SelectItem key={(index + 1).toString()} value={month}>
                  {month}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Día"
              selectedKeys={new Set(data.day ? [data.day] : [])}
              onSelectionChange={(value) => {
                setErrors((prev) => ({ ...prev, day: "" }));
                if (value !== "all")
                  setData({ ...data, day: value.values().next().value });
              }}
              errorMessage={errors.day}
              isInvalid={Boolean(errors.day)}
            >
              {Array.from(
                {
                  length: new Date(
                    parseInt(data.year),
                    parseInt(data.month),
                    0
                  ).getDate(),
                },
                (_, i) => i + 1
              ).map((day) => (
                <SelectItem key={day.toString()} value={day.toString()}>
                  {day.toString()}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-row gap-4">
            <Select
              className="flex-1"
              isRequired
              label="Día"
              selectedKeys={new Set(data.day ? [data.day] : [])}
              onSelectionChange={(value) => {
                setErrors((prev) => ({ ...prev, day: "" }));
                if (value !== "all")
                  setData({ ...data, day: value.values().next().value });
              }}
              errorMessage={errors.day}
              isInvalid={Boolean(errors.day)}
            >
              {Array.from(
                {
                  length: new Date(
                    parseInt(data.year),
                    parseInt(data.month),
                    0
                  ).getDate(),
                },
                (_, i) => i + 1
              ).map((day) => (
                <SelectItem key={day.toString()} value={day.toString()}>
                  {day.toString()}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="flex-1"
              isRequired
              label="Día"
              selectedKeys={new Set(data.day ? [data.day] : [])}
              onSelectionChange={(value) => {
                setErrors((prev) => ({ ...prev, day: "" }));
                if (value !== "all")
                  setData({ ...data, day: value.values().next().value });
              }}
              errorMessage={errors.day}
              isInvalid={Boolean(errors.day)}
            >
              {Array.from(
                {
                  length: new Date(
                    parseInt(data.year),
                    parseInt(data.month),
                    0
                  ).getDate(),
                },
                (_, i) => i + 1
              ).map((day) => (
                <SelectItem key={day.toString()} value={day.toString()}>
                  {day.toString()}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              fullWidth
              color="primary"
              type="submit"
              isDisabled={
                !data.centerId ||
                !data.year ||
                !data.month ||
                !data.day ||
                Boolean(errors.centerId) ||
                Boolean(errors.year) ||
                Boolean(errors.month) ||
                Boolean(errors.day)
              }
            >
              Solicitar cita
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
