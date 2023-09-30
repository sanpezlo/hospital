import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  date: z.coerce.date({
    required_error: "La fecha es requerida",
    invalid_type_error: "La fecha debe ser válida",
  }),
  patientId: z.string({
    required_error: "El paciente es requerido",
    invalid_type_error: "El paciente debe ser un texto",
  }),
  doctorId: z.string({
    required_error: "El doctor es requerido",
    invalid_type_error: "El doctor debe ser un texto",
  }),
});

export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;

export const UpdateAppointmentSchema = z.object({
  date: z.coerce
    .date({
      invalid_type_error: "La fecha debe ser válida",
    })
    .optional(),

  doctorId: z
    .string({
      invalid_type_error: "El doctor debe ser un texto",
    })
    .optional(),
});

export type UpdateAppointment = z.infer<typeof UpdateAppointmentSchema>;
