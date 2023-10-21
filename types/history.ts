import { z } from "zod";

export const UpdateHistorySchema = z.object({
  status: z.string({
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser un texto",
  }),
});

export type UpdateHistory = z.infer<typeof UpdateHistorySchema>;
