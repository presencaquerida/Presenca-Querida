import { NextResponse } from "next/server";
import { createGuest, getEventBundle, updateMemoryApproval } from "@/lib/data";
import { requireAccess } from "@/lib/auth";
import type { Guest } from "@/lib/types";

type RouteContext = { params: { slug: string } };

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request, { params }: RouteContext) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope");
  const access = await requireAccess(request, {
    role: scope === "cliente" ? undefined : "gestao",
    eventSlug: params.slug
  });

  if (!access.allowed) return errorResponse(access.reason ?? "Acesso negado.", 401);

  const bundle = await getEventBundle(params.slug);
  if (!bundle) return errorResponse("Evento não encontrado.", 404);

  return NextResponse.json(bundle);
}

export async function POST(request: Request, { params }: RouteContext) {
  const body = await request.json().catch(() => null) as { action?: string; guest?: Partial<Guest> & { groupName?: string }; id?: string; isApproved?: boolean } | null;
  if (!body?.action) return errorResponse("Ação não informada.");

  const isClientAction = body.action === "create_guest";
  const access = await requireAccess(request, {
    role: isClientAction ? undefined : "gestao",
    eventSlug: params.slug
  });

  if (!access.allowed) return errorResponse(access.reason ?? "Acesso negado.", 401);

  if (body.action === "create_guest") {
    const guestPayload = body.guest;
    if (!guestPayload?.fullName) return errorResponse("Informe o nome principal do convidado.");
    const guest = await createGuest(params.slug, guestPayload);
    return NextResponse.json({ guest });
  }

  if (body.action === "approve_memory") {
    if (!body.id) return errorResponse("Depoimento não informado.");
    const memory = await updateMemoryApproval(body.id, Boolean(body.isApproved));
    return NextResponse.json({ memory });
  }

  return errorResponse("Ação não suportada.");
}
