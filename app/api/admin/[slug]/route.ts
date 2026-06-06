import { NextResponse } from "next/server";
import { requireAccess } from "@/lib/auth";
import { createGuest, getEventBundle, updateEvent, updateMemoryApproval, updateMessageTemplate } from "@/lib/data";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope");
  const access = await requireAccess(request, {
    role: scope === "cliente" ? undefined : "gestao",
    eventSlug: params.slug
  });

  if (!access.allowed) {
    return NextResponse.json({ error: access.reason || "Acesso não autorizado." }, { status: 401 });
  }

  const bundle = await getEventBundle(params.slug);
  if (!bundle) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  return NextResponse.json(bundle);
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const action = body?.action;
  const access = await requireAccess(request, {
    role: action === "approve_memory" ? "gestao" : undefined,
    eventSlug: params.slug
  });

  if (!access.allowed) {
    return NextResponse.json({ error: access.reason || "Acesso não autorizado." }, { status: 401 });
  }

  try {
    if (action === "create_guest") {
      const guest = await createGuest(params.slug, body.guest ?? {});
      return NextResponse.json({ ok: true, guest });
    }

    if (action === "update_event") {
      const event = await updateEvent(params.slug, body.event ?? {});
      return NextResponse.json({ ok: true, event });
    }

    if (action === "update_message") {
      const template = await updateMessageTemplate(String(body.id || ""), String(body.body || ""));
      return NextResponse.json({ ok: true, template });
    }

    if (action === "approve_memory") {
      const memory = await updateMemoryApproval(String(body.id || ""), Boolean(body.isApproved));
      return NextResponse.json({ ok: true, memory });
    }

    return NextResponse.json({ error: "Ação não reconhecida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao processar solicitação." }, { status: 500 });
  }
}
