import { hasAdminAccess } from "@/lib/admin";
import { getEventBundle } from "@/lib/data";
import { statusLabels } from "@/lib/status";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  if (!hasAdminAccess(request)) {
    return new Response("Acesso não autorizado.", { status: 401 });
  }

  const bundle = await getEventBundle(params.slug);
  if (!bundle) return new Response("Evento não encontrado.", { status: 404 });

  const groups = new Map(bundle.groups.map((group) => [group.id, group.name]));
  const header = ["nome", "nome_curto", "telefone", "grupo", "status", "adultos", "criancas", "observacao_buffet", "recado", "link"];
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const rows = bundle.guests.map((guest) => [
    guest.fullName,
    guest.shortName,
    guest.phone,
    guest.groupId ? groups.get(guest.groupId) ?? "" : "",
    statusLabels[guest.status],
    guest.companionsAdults,
    guest.companionsChildren,
    guest.dietaryNotes,
    guest.notes,
    `${origin.replace(/\/$/, "")}/convite/${guest.token}`
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new Response(`\ufeff${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="presenca-querida-${params.slug}-convidados.csv"`
    }
  });
}
