import type { GuestStatus } from "./types";

export const statusLabels: Record<GuestStatus, string> = {
  pending: "Pendente",
  save_date_sent: "Save the date enviado",
  invited: "Convite enviado",
  confirmed: "Confirmado",
  maybe: "Talvez",
  declined: "Não poderá ir"
};

export const statusTone: Record<GuestStatus, string> = {
  pending: "tone-neutral",
  save_date_sent: "tone-info",
  invited: "tone-info",
  confirmed: "tone-success",
  maybe: "tone-warning",
  declined: "tone-danger"
};

export function formatDateBR(date: string): string {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function formatTime(time: string): string {
  return time?.slice(0, 5) ?? "";
}

export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

export function slugifyToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function totalPeople(guest: { companionsAdults: number; companionsChildren: number }): number {
  return guest.companionsAdults + guest.companionsChildren;
}
