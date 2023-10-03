import { z } from "zod";

export const CreateAdminSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener como máximo 100 caracteres")
    .regex(new RegExp("^[^0-9]*$"), {
      message: "El nombre no debe contener números",
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
  newPassword: z
    .string({
      invalid_type_error: "La nueva contraseña debe ser un texto",
    })
    .min(6, {
      message: "La nueva contraseña debe tener al menos 6 caracteres",
    })
    .max(100, {
      message: "La nueva contraseña debe tener como máximo 100 caracteres",
    })
    .optional(),
});

export type UpdateAdmin = z.infer<typeof UpdateAdminSchema>;

export const CreateUserSchema = CreateAdminSchema.extend({
  centerId: z.string({
    required_error: "El centro es requerido",
    invalid_type_error: "El centro debe ser un texto",
  }),
  schedules: z
    .array(
      z.object(
        {
          startTime: z.string({
            required_error: "La hora de inicio es requerida",
            invalid_type_error: "La hora de inicio debe ser un texto",
          }),
          departureTime: z.string({
            required_error: "La hora de finalización es requerida",
            invalid_type_error: "La hora de finalización debe ser un texto",
          }),
          days: z
            .array(
              z.string({
                required_error: "El día es requerido",
                invalid_type_error: "El día debe ser un texto",
              }),
              {
                required_error: "Los días son requeridos",
                invalid_type_error: "Los días deben ser un arreglo de textos",
              }
            )
            .min(1, { message: "Debe haber al menos un día" }),
        },
        {
          required_error: "El horario es requerido",
          invalid_type_error: "El horario debe ser un objeto",
        }
      ),
      {
        required_error: "Los horarios son requeridos",
        invalid_type_error: "Los horarios deben ser un arreglo de objetos",
      }
    )
    .min(1, { message: "Debe haber al menos un horario" }),
  specialization: z
    .string({
      invalid_type_error: "La especialización debe ser un texto",
    })
    .optional(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UpdateAdminSchema.extend({
  centerId: z
    .string({
      invalid_type_error: "El centro debe ser un texto",
    })
    .optional(),
  specialization: z
    .string({
      invalid_type_error: "La especialización debe ser un texto",
    })
    .optional(),
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
