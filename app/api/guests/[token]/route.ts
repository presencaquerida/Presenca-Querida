import { NextResponse } from "next/server";
import { createMemory, getGuestByToken, updateGuestByToken } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const match = await getGuestByToken(params.token);
  if (!match) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  return NextResponse.json(match);
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const body = await request.json();
    const guest = await updateGuestByToken(params.token, body.guest || {});
    if (!guest) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });

    let memory = null;
    if (String(body.memory || "").trim()) {
      memory = await createMemory(params.token, String(body.memory).trim());
    }

    return NextResponse.json({ guest, memory });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao confirmar presença.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
