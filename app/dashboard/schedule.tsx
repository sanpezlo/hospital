"use client";

import React, { Dispatch, SetStateAction, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Chip,
  SelectedItems,
  Selection,
} from "@nextui-org/react";
import { CreateUser } from "@/types/user";
import { militaryTime } from "@/lib/parse";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

const hours = [
  "12:00",
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
] as const;

const periods = ["AM", "PM"] as const;

export default function Schedule({
  isOpen,
  onOpenChange,
  onPress,
  setData,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onPress: () => void;
  setData: Dispatch<SetStateAction<CreateUser>>;
}) {
  const [schedule, setSchedule] = useState<{
    startTime: string;
    stratPeriod: "AM" | "PM";
    departureTime: string;
    departurePeriod: "AM" | "PM";
    days: Selection;
  }>({
    startTime: hours[0],
    stratPeriod: periods[0],
    departureTime: hours[hours.length - 1],
    departurePeriod: periods[periods.length - 1],
    days: new Set([days[0]]),
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Crear horario</ModalHeader>
            <ModalBody>
              <div className="flex gap-2">
                <Select
                  isRequired
                  label="Hora de entrada"
                  placeholder="Seleccione la hora de entrada"
                  selectedKeys={new Set([schedule.startTime])}
                  onSelectionChange={(value) =>
                    value !== "all" &&
                    value.size !== 0 &&
                    setSchedule({
                      ...schedule,
                      startTime: value.values().next().value,
                    })
                  }
                >
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  className="flex-1"
                  isRequired
                  label="Periodo"
                  placeholder="Seleccione el periodo de la hora de entrada"
                  selectedKeys={new Set([schedule.stratPeriod])}
                  onSelectionChange={(value) =>
                    value !== "all" &&
                    value.size !== 0 &&
                    setSchedule({
                      ...schedule,
                      stratPeriod: value.values().next().value,
                    })
                  }
                >
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Select
                  isRequired
                  label="Hora de salida"
                  placeholder="Seleccione la hora de salida"
                  selectedKeys={new Set([schedule.departureTime])}
                  onSelectionChange={(value) =>
                    value !== "all" &&
                    value.size !== 0 &&
                    setSchedule({
                      ...schedule,
                      departureTime: value.values().next().value,
                    })
                  }
                >
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  className="flex-1"
                  isRequired
                  label="Periodo"
                  placeholder="Seleccione el periodo de la hora de salida"
                  selectedKeys={new Set([schedule.departurePeriod])}
                  onSelectionChange={(value) =>
                    value !== "all" &&
                    value.size !== 0 &&
                    setSchedule({
                      ...schedule,
                      departurePeriod: value.values().next().value,
                    })
                  }
                >
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Select
                isRequired
                label="Dias"
                placeholder="Seleccione los dias"
                selectedKeys={schedule.days}
                onSelectionChange={(value) =>
                  value !== "all" &&
                  value.size !== 0 &&
                  setSchedule({ ...schedule, days: value })
                }
                isMultiline={true}
                selectionMode="multiple"
                renderValue={(items: SelectedItems<string>) => (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Chip
                        variant="faded"
                        key={item.key}
                        onClose={() =>
                          setSchedule((prev) => {
                            if (prev.days === "all" || prev.days.size === 1)
                              return prev;
                            const next = new Set(prev.days);
                            next.delete(item.key as string);
                            return { ...prev, days: next };
                          })
                        }
                      >
                        {item.textValue}
                      </Chip>
                    ))}
                  </div>
                )}
              >
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
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
                onPress={(e) => {
                  setData((prev) => ({
                    ...prev,
                    schedules: [
                      ...prev.schedules,
                      {
                        startTime: militaryTime(
                          schedule.startTime,
                          schedule.stratPeriod
                        ),
                        departureTime: militaryTime(
                          schedule.departureTime,
                          schedule.departurePeriod
                        ),
                        days: Array.from(schedule.days) as string[],
                      },
                    ],
                  }));
                  setSchedule({
                    startTime: hours[0],
                    stratPeriod: periods[0],
                    departureTime: hours[hours.length - 1],
                    departurePeriod: periods[periods.length - 1],
                    days: new Set([days[0]]),
                  });

                  onClose();
                }}
              >
                Crear
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
