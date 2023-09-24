import { z } from "zod";

export const CreateCenterSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres"),
  address: z
    .string({
      required_error: "La dirección es requerida",
      invalid_type_error: "La dirección debe ser un texto",
    })
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(100, "La dirección debe tener como máximo 100 caracteres"),
  city: z
    .string({
      required_error: "La ciudad es requerida",
      invalid_type_error: "La ciudad debe ser un texto",
    })
    .min(3, "La ciudad debe tener al menos 3 caracteres")
    .max(100, "La ciudad debe tener como máximo 100 caracteres"),
  phone: z
    .string({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser un texto",
    })
    .length(10, "El teléfono debe tener 10 dígitos")
    .regex(new RegExp("^[0-9]*$"), {
      message: "El teléfono debe contener solo números",
    }),
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
      invalid_type_error: "El correo electrónico debe ser un texto",
    })
    .email({
      message: "El correo electrónico debe ser válido",
    }),
});

export type CreateCenter = z.infer<typeof CreateCenterSchema>;

export const UpdateCenterSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres")
    .optional(),
  address: z
    .string({
      invalid_type_error: "La dirección debe ser un texto",
    })
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(100, "La dirección debe tener como máximo 100 caracteres")
    .optional(),
  city: z
    .string({
      invalid_type_error: "La ciudad debe ser un texto",
    })
    .min(3, "La ciudad debe tener al menos 3 caracteres")
    .max(100, "La ciudad debe tener como máximo 100 caracteres")
    .optional(),
  phone: z
    .string({
      invalid_type_error: "El teléfono debe ser un texto",
    })
    .length(10, "El teléfono debe tener 10 dígitos")
    .regex(new RegExp("^[0-9]*$"), {
      message: "El teléfono debe contener solo números",
    })
    .optional(),
  email: z
    .string({
      invalid_type_error: "El correo electrónico debe ser un texto",
    })
    .email({
      message: "El correo electrónico debe ser válido",
    })
    .optional(),
});

export type UpdateCenter = z.infer<typeof UpdateCenterSchema>;
