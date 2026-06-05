import type { EventInfo, Guest, MessageTemplate } from "./types";
import { formatDateBR, formatTime } from "./status";

export function renderMessage(template: MessageTemplate, event: EventInfo, guest: Guest, baseUrl: string): string {
  const link = `${baseUrl.replace(/\/$/, "")}/convite/${guest.token}`;
  const segredo = event.isSurprise ? "Importante: é surpresa, então não comente com a Dani. 🤫" : "";

  return template.body
    .replaceAll("{{nome}}", guest.shortName || guest.fullName)
    .replaceAll("{{evento}}", event.title)
    .replaceAll("{{data}}", formatDateBR(event.eventDate))
    .replaceAll("{{horario}}", `${formatTime(event.startTime)} às ${formatTime(event.endTime)}`)
    .replaceAll("{{local}}", event.locationName)
    .replaceAll("{{banda}}", event.bandName)
    .replaceAll("{{link}}", link)
    .replaceAll("{{segredo}}", segredo);
}
