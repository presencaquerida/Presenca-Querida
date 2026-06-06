import { NextResponse } from "next/server";
import { createMemory, getGuestByToken, updateGuestByToken } from "@/lib/data";
import type { GuestStatus } from "@/lib/types";

type Params = { params: { token: string } };

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const match = await getGuestByToken(params.token);
    if (!match) return jsonError("Convite não encontrado.", 404);
    return NextResponse.json(match);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Erro ao carregar convite.", 500);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null) as {
      status?: GuestStatus;
      companionsAdults?: number;
      companionsChildren?: number;
      dietaryNotes?: string;
      notes?: string;
      memoryMessage?: string;
    } | null;

    if (!body) return jsonError("Dados não informados.");

    const guest = await updateGuestByToken(params.token, {
      status: body.status,
      companionsAdults: Number(body.companionsAdults ?? 0),
      companionsChildren: Number(body.companionsChildren ?? 0),
      dietaryNotes: body.dietaryNotes || "",
      notes: body.notes || ""
    });

    let memory = null;
    if (body.memoryMessage?.trim()) {
      memory = await createMemory(params.token, body.memoryMessage.trim());
    }

    if (!guest) return jsonError("Convite não encontrado.", 404);
    return NextResponse.json({ guest, memory });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Erro ao salvar confirmação.", 500);
  }
}
