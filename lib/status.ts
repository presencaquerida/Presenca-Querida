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
  pending: "neutral",
  save_date_sent: "info",
  invited: "info",
  confirmed: "success",
  maybe: "warning",
  declined: "danger"
};

export function normalizePhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

export function formatTime(time: string): string {
  return time.slice(0, 5).replace(":", "h");
}
