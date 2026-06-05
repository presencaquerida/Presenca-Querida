import { NextResponse } from "next/server";
import { createMemory, getGuestByToken, updateGuestByToken } from "@/lib/data";
import type { GuestStatus } from "@/lib/types";

type RouteContext = { params: { token: string } };

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const match = await getGuestByToken(params.token);
  if (!match) return errorResponse("Convite não encontrado.", 404);
  return NextResponse.json(match);
}

export async function POST(request: Request, { params }: RouteContext) {
  const body = await request.json().catch(() => null) as {
    status?: GuestStatus;
    companionsAdults?: number;
    companionsChildren?: number;
    dietaryNotes?: string;
    notes?: string;
    memoryMessage?: string;
  } | null;

  if (!body?.status) return errorResponse("Informe sua resposta.");

  const guest = await updateGuestByToken(params.token, {
    status: body.status,
    companionsAdults: Number(body.companionsAdults ?? 0),
    companionsChildren: Number(body.companionsChildren ?? 0),
    dietaryNotes: body.dietaryNotes ?? "",
    notes: body.notes ?? ""
  });

  let memory = null;
  if (body.memoryMessage?.trim()) {
    memory = await createMemory(params.token, body.memoryMessage.trim());
  }

  return NextResponse.json({ guest, memory });
}
