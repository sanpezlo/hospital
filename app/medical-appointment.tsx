"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";
import { Center, MedicalAppointment, Schedule, User } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { capitalize, militaryTime, standardTime } from "@/lib/parse";
import { CreateAppointment } from "@/types/appointment";

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
] as const;

const hours = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
] as const;

const years = [
  new Date().getFullYear().toString(),
  (new Date().getFullYear() + 1).toString(),
];

export default function MedicalAppointment() {
  const { data: session, status } = useSession();

  const [data, setData] = useState({
    centerId: "",
    doctorId: "",
    year: years[0],
    month: "",
    day: "",
    hour: "",
  });

  const [errors, setErrors] = useState({
    centerId: "",
    doctorId: "",
    year: "",
    month: "",
    day: "",
    hour: "",
  });

  const { data: centers, isLoading } = useSWR<Center[]>(
    "/api/center",
    fetcher()
  );

  const { data: doctors, isLoading: isLoadingDoctors } = useSWR<User[]>(
    data.centerId ? "/api/user/doctor/center/" + data.centerId : null,
    fetcher()
  );

  const { data: schedules, isLoading: isLoadingSchedules } = useSWR<Schedule[]>(
    data.doctorId ? "/api/schedule/" + data.doctorId : null,
    fetcher()
  );

  const { data: appointments, isLoading: isLoadingAppointments } = useSWR<
    MedicalAppointment[]
  >(
    data.doctorId ? "/api/appointment/doctor/" + data.doctorId : null,
    fetcher()
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bodyRequest: CreateAppointment = {
      date: new Date(
        parseInt(data.year),
        parseInt(data.month) - 1,
        parseInt(data.day),
        parseInt(
          militaryTime(
            data.hour.slice(0, -3),
            data.hour.slice(-2) as "AM" | "PM"
          )
        )
      ),
      doctorId: data.doctorId,
      patientId: session?.user.id || "",
    };

    const response = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyRequest),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        centerId: "",
        doctorId: "",
        year: years[0],
        month: "",
        day: "",
        hour: "",
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
        setErrors((prev) => ({ ...prev, centerId: body.error.message }));
      }
    } else {
      console.log({ response, body });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-4">
        <h3 className="text-md">Agendar cita</h3>
      </CardHeader>
      <Divider />
      <CardBody className="overflow-hidden">
        <form
          id="appointment"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Select
            isRequired
            label="Centro"
            placeholder="Selecciona un centro"
            selectedKeys={new Set(data.centerId ? [data.centerId] : [])}
            onSelectionChange={(value) => {
              setErrors((prev) => ({ ...prev, centerId: "" }));
              if (value !== "all")
                setData({
                  ...data,
                  centerId: value.values().next().value,
                  doctorId: "",
                  day: "",
                  hour: "",
                });
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

          <Select
            isRequired
            label="Doctor"
            placeholder="Selecciona un doctor"
            selectedKeys={new Set(data.doctorId ? [data.doctorId] : [])}
            onSelectionChange={(value) => {
              setErrors((prev) => ({ ...prev, doctorId: "" }));
              if (value !== "all")
                setData({
                  ...data,
                  doctorId: value.values().next().value,
                  day: "",
                  hour: "",
                });
            }}
            isLoading={isLoadingDoctors}
            isDisabled={(doctors || []).length === 0}
            errorMessage={
              errors.doctorId
                ? errors.doctorId
                : !isLoadingDoctors &&
                  (doctors || []).length === 0 &&
                  "No hay doctores disponibles"
            }
            isInvalid={Boolean(errors.doctorId)}
          >
            {(doctors || []).map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.name as string}>
                {doctor.name}
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
                    month: "",
                    day: "",
                    hour: "",
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
                    hour: "",
                  });
              }}
              disabledKeys={months
                .map((month, index) => (index + 1).toString())
                .filter((month, index) => {
                  const m = new Date().getMonth();

                  if (data.year === years[0]) return index < m;

                  console.log({ m, index }, index > m);
                  return index > m;
                })}
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
                  setData({
                    ...data,
                    day: value.values().next().value,
                    hour: "",
                  });
              }}
              isDisabled={
                !data.year ||
                !data.month ||
                !data.doctorId ||
                isLoadingSchedules ||
                schedules?.length === 0
              }
              isLoading={isLoadingSchedules}
              errorMessage={
                errors.day
                  ? errors.day
                  : (!data.doctorId || (schedules || []).length === 0) &&
                    "No hay días disponibles"
              }
              isInvalid={Boolean(errors.day)}
              disabledKeys={[
                ...Array.from(
                  {
                    length: new Date(
                      parseInt(data.year),
                      parseInt(data.month),
                      0
                    ).getDate(),
                  },
                  (_, i) => i + 1
                )
                  .filter((day) => {
                    const date = new Date(
                      parseInt(data.year),
                      parseInt(data.month) - 1,
                      day
                    );

                    const dayName = capitalize(
                      date.toLocaleDateString("es", {
                        weekday: "long",
                      })
                    );

                    return !schedules?.some((schedule) =>
                      schedule.days.some((day) => day === dayName)
                    );
                  })
                  .map((day) => day.toString()),
                ...Array.from(
                  {
                    length: new Date(
                      parseInt(data.year),
                      parseInt(data.month),
                      0
                    ).getDate(),
                  },
                  (_, i) => i + 1
                )
                  .filter((day) => {
                    const date = new Date();

                    const today = date.getDate();

                    if (
                      data.year === years[0] &&
                      data.month === (date.getMonth() + 1).toString()
                    ) {
                      return day <= today;
                    }
                    return false;
                  })
                  .map((day) => day.toString()),
              ]}
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

          <Select
            isRequired
            label="Hora"
            placeholder="Selecciona una hora"
            selectedKeys={new Set(data.hour ? [data.hour] : [])}
            onSelectionChange={(value) => {
              setErrors((prev) => ({ ...prev, hour: "" }));
              if (value !== "all")
                setData({ ...data, hour: value.values().next().value });
            }}
            errorMessage={
              errors.hour
                ? errors.hour
                : !data.day && "No hay horas disponibles"
            }
            isInvalid={Boolean(errors.hour)}
            isDisabled={
              !data.year ||
              !data.month ||
              !data.doctorId ||
              !data.day ||
              isLoadingSchedules ||
              schedules?.length === 0
            }
            isLoading={isLoadingAppointments}
            disabledKeys={[
              ...hours.filter((hour) => {
                const date = new Date(
                  parseInt(data.year),
                  parseInt(data.month) - 1,
                  parseInt(data.day)
                );

                const dayName = capitalize(
                  date.toLocaleDateString("es", {
                    weekday: "long",
                  })
                );

                const schedulesAvailable = schedules?.filter((schedule) =>
                  schedule.days.some((day) => day === dayName)
                );

                const time = parseInt(
                  militaryTime(hour.slice(0, -3), hour.slice(-2) as "AM" | "PM")
                );

                return !schedulesAvailable?.some((schedule) => {
                  return (
                    parseInt(schedule.startTime) <= time &&
                    parseInt(schedule.departureTime) >= time
                  );
                });
              }),
              ...(appointments || [])
                .map((appointment) => new Date(appointment.date))
                .filter(
                  (date) =>
                    date.getFullYear() === parseInt(data.year) &&
                    date.getMonth() === parseInt(data.month) - 1 &&
                    date.getDate() === parseInt(data.day)
                )
                .map((date) => standardTime(`${date.getHours()}:00`)),
            ]}
          >
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </Select>

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
                !data.hour ||
                Boolean(errors.centerId) ||
                Boolean(errors.year) ||
                Boolean(errors.month) ||
                Boolean(errors.day) ||
                Boolean(errors.hour)
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
