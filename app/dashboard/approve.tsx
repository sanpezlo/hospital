import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import { MedicalAppointment, Schedule } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { capitalize, militaryTime, standardTime } from "@/lib/parse";
import { UpdateAppointment } from "@/types/appointment";

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

export default function Approve({
  isOpen,
  doctorId,
  id,
  onOpenChange,
}: {
  isOpen: boolean;
  doctorId: string;
  id: string;
  onOpenChange: () => void;
}) {
  const [data, setData] = useState({
    year: years[0],
    month: "",
    day: "",
    hour: "",
  });

  const [errors, setErrors] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
  });

  const { data: schedules, isLoading: isLoadingSchedules } = useSWR<Schedule[]>(
    "/api/schedule/" + doctorId,
    fetcher()
  );

  const { data: appointments, isLoading: isLoadingAppointments } = useSWR<
    MedicalAppointment[]
  >("/api/appointment/doctor/" + doctorId, fetcher());

  const handleSubmit = async (onClose: () => void) => {
    const bodyRequest: UpdateAppointment = {
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
    };

    const response = await fetch("/api/appointment/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyRequest),
    });

    const body = await response.json();

    if (response.ok) {
      onClose();
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
        setErrors((prev) => ({ ...prev, password: body.error.message }));
      }
    } else {
      console.log({ response, body });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1>Agendar cita</h1>
            </ModalHeader>
            <ModalBody>
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
                    isLoadingSchedules ||
                    schedules?.length === 0
                  }
                  errorMessage={
                    errors.day
                      ? errors.day
                      : (schedules || []).length === 0 &&
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
                      militaryTime(
                        hour.slice(0, -3),
                        hour.slice(-2) as "AM" | "PM"
                      )
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  handleSubmit(onClose);
                }}
              >
                Agendar Cita
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
