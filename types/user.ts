import { z } from "zod";

export const CreateAdminSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres"),
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
      invalid_type_error: "El correo electrónico debe ser un texto",
    })
    .email({
      message: "El correo electrónico debe ser válido",
    }),
});

export type CreateAdmin = z.infer<typeof CreateAdminSchema>;

export const UpdateAdminSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres")
    .optional(),
  email: z
    .string({
      invalid_type_error: "El correo electrónico debe ser un texto",
    })
    .email({
      message: "El correo electrónico debe ser válido",
    })
    .optional(),
  password: z
    .string({
      invalid_type_error: "La contraseña debe ser un texto",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(100, {
      message: "La contraseña debe tener como máximo 100 caracteres",
    })
    .optional(),
});

export type UpdateAdmin = z.infer<typeof UpdateAdminSchema>;

export const CreateUserSchema = CreateAdminSchema.extend({
  centerId: z.string({
    required_error: "El centro es requerido",
    invalid_type_error: "El centro debe ser un texto",
  }),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UpdateAdminSchema.extend({
  centerId: z.string({
    invalid_type_error: "El centro debe ser un texto",
  }),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const CreatePatientSchema = CreateAdminSchema.extend({
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser un texto",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(100, {
      message: "La contraseña debe tener como máximo 100 caracteres",
    }),
});

export type CreatePatient = z.infer<typeof CreatePatientSchema>;

export const UpdatePatientSchema = UpdateAdminSchema;

export type UpdatePatient = z.infer<typeof UpdatePatientSchema>;
