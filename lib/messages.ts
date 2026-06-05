import type { EventInfo, Guest, MessageTemplate } from "./types";
import { formatDateBR, formatTime } from "./status";

export function publicBaseUrl(origin?: string): string {
  return process.env.NEXT_PUBLIC_SITE_URL || origin || "http://localhost:3000";
}

export function renderMessage(template: MessageTemplate, event: EventInfo, guest: Guest, origin?: string): string {
  const baseUrl = publicBaseUrl(origin);
  const link = `${baseUrl}/convite/${guest.token}`;
  const secret = event.isSurprise ? "Importante: é surpresa, então não comente com a Dani, combinado? 🤫" : "";
  const invitedNames = guest.invitedNames?.length ? guest.invitedNames.join(", ") : guest.fullName;

  return template.body
    .replaceAll("{{nome}}", guest.shortName || guest.fullName)
    .replaceAll("{{convidados}}", invitedNames)
    .replaceAll("{{data}}", formatDateBR(event.eventDate))
    .replaceAll("{{horario}}", `${formatTime(event.startTime)} às ${formatTime(event.endTime)}`)
    .replaceAll("{{local}}", event.locationName)
    .replaceAll("{{banda}}", event.bandName)
    .replaceAll("{{link}}", link)
    .replaceAll("{{segredo}}", secret);
}
