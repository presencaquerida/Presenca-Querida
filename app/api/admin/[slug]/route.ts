import { NextResponse } from "next/server";
import { requireAccess } from "@/lib/auth";
import { createGuest, getEventBundle, updateEvent, updateGuestByToken, updateMemoryApproval, updateMessageTemplate } from "@/lib/data";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") === "cliente" ? "cliente" : "gestao";
  const access = await requireAccess(request, { role: scope, eventSlug: params.slug });
  if (!access.allowed) return NextResponse.json({ error: access.reason ?? "Acesso negado." }, { status: 401 });

  const bundle = await getEventBundle(params.slug);
  if (!bundle) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  return NextResponse.json(bundle);
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const body = await request.json();
  const action = String(body.action ?? "");
  const access = await requireAccess(request, { role: action === "create_guest" ? "cliente" : "gestao", eventSlug: params.slug });
  if (!access.allowed) return NextResponse.json({ error: access.reason ?? "Acesso negado." }, { status: 401 });

  if (action === "create_guest") {
    const guest = await createGuest(params.slug, body.guest ?? {});
    return NextResponse.json(guest);
  }

  if (action === "update_guest") {
    const guest = await updateGuestByToken(String(body.token), body.guest ?? {});
    return NextResponse.json(guest);
  }

  if (action === "update_event") {
    const event = await updateEvent(params.slug, body.event ?? {});
    return NextResponse.json(event);
  }

  if (action === "update_template") {
    const template = await updateMessageTemplate(String(body.id), String(body.body ?? ""));
    return NextResponse.json(template);
  }

  if (action === "approve_memory") {
    const memory = await updateMemoryApproval(String(body.id), Boolean(body.isApproved));
    return NextResponse.json(memory);
  }

  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}
