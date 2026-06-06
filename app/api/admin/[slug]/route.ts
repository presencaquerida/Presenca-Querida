import { NextResponse } from "next/server";
import { createGuest, getEventBundle, updateEvent, updateMemoryApproval, updateMessageTemplate } from "@/lib/data";
import { requireAccess } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const access = await requireAccess(request, { eventSlug: slug });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso negado." }, { status: 403 });

  const bundle = await getEventBundle(slug);
  if (!bundle) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  return NextResponse.json(bundle);
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const access = await requireAccess(request, { eventSlug: slug });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso negado." }, { status: 403 });

  try {
    const body = await request.json();
    const action = body?.action;

    if (action === "create_guest") {
      const guest = await createGuest(slug, body.guest || {});
      return NextResponse.json({ guest });
    }

    if (action === "update_event") {
      const event = await updateEvent(slug, body.event || {});
      return NextResponse.json({ event });
    }

    if (action === "update_message") {
      const template = await updateMessageTemplate(String(body.id || ""), String(body.body || ""));
      return NextResponse.json({ template });
    }

    if (action === "approve_memory") {
      const memory = await updateMemoryApproval(String(body.id || ""), Boolean(body.isApproved));
      return NextResponse.json({ memory });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
