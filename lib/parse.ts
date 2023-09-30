import { Role } from "@prisma/client";

export function role(role: Role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "DIRECTOR") return "Director";
  if (role === "DOCTOR") return "Doctor";
  if (role === "SECRETARY") return "Secretaria";
  if (role === "PATIENT") return "Paciente";
}

export function militaryTime(time: string, period: "AM" | "PM") {
  let t = parseInt(time);
  if (t === 12 && period === "AM") return "00:00";
  if (period === "AM") return `${t}:00`;
  if (t === 12 && period === "PM") return "12:00";
  return `${t + 12}:00`;
}

export function standardTime(time: string) {
  let t = parseInt(time);
  if (t === 0) return "12:00 AM";
  if (t < 12) return `${t}:00 AM`;
  if (t === 12) return "12:00 PM";
  return `${t - 12}:00 PM`;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
