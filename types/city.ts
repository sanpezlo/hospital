import { z } from "zod";

export const CreateCitySchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres"),
  departmentId: z.string({
    required_error: "El departamento es requerido",
    invalid_type_error: "El departamento debe ser un texto",
  }),
});

export type CreateCity = z.infer<typeof CreateCitySchema>;

export const UpdateCitySchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres")
    .optional(),
  departmentId: z
    .string({
      invalid_type_error: "El departamento debe ser un texto",
    })
    .optional(),
});

export type UpdateCity = z.infer<typeof UpdateCitySchema>;
