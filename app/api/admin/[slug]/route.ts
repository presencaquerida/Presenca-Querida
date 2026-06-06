import { NextResponse } from "next/server";
import { createGuest, getEventBundle, updateEvent, updateMemoryApproval, updateMessageTemplate } from "@/lib/data";
import { requireAccess } from "@/lib/auth";
import type { Guest, EventInfo } from "@/lib/types";

type Params = { params: { slug: string } };

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request, { params }: Params) {
  try {
    const url = new URL(request.url);
    const isClienteScope = url.searchParams.get("scope") === "cliente";
    const access = await requireAccess(request, {
      role: isClienteScope ? undefined : "gestao",
      eventSlug: params.slug
    });

    if (!access.allowed) return jsonError(access.reason || "Acesso não autorizado.", 401);

    const bundle = await getEventBundle(params.slug);
    if (!bundle) return jsonError("Evento não encontrado.", 404);

    return NextResponse.json(bundle);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Erro ao carregar dados.", 500);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null) as {
      action?: string;
      guest?: Partial<Guest> & { groupName?: string };
      event?: Partial<EventInfo>;
      id?: string;
      body?: string;
      isApproved?: boolean;
    } | null;

    if (!body?.action) return jsonError("Ação não informada.");

    const actionNeedsGestao = ["approve_memory"].includes(body.action);
    const access = await requireAccess(request, {
      role: actionNeedsGestao ? "gestao" : undefined,
      eventSlug: params.slug
    });

    if (!access.allowed) return jsonError(access.reason || "Acesso não autorizado.", 401);

    if (body.action === "create_guest") {
      if (!body.guest?.fullName) return jsonError("Informe o nome principal do convite.");
      const guest = await createGuest(params.slug, body.guest);
      return NextResponse.json({ guest });
    }

    if (body.action === "update_event") {
      const event = await updateEvent(params.slug, body.event || {});
      return NextResponse.json({ event });
    }

    if (body.action === "update_message") {
      if (!body.id) return jsonError("Modelo de mensagem não informado.");
      const template = await updateMessageTemplate(body.id, body.body || "");
      return NextResponse.json({ template });
    }

    if (body.action === "approve_memory") {
      if (!body.id) return jsonError("Depoimento não informado.");
      const memory = await updateMemoryApproval(body.id, Boolean(body.isApproved));
      return NextResponse.json({ memory });
    }

    return jsonError("Ação não reconhecida.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Erro ao processar solicitação.", 500);
  }
}
