import { Role } from "@prisma/client";

export function role(role: Role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "DIRECTOR") return "Director";
  if (role === "DOCTOR") return "Doctor";
  if (role === "SECRETARY") return "Secretaria";
  if (role === "PATIENT") return "Paciente";
}
