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
    const action = body?.action;

    if (action === "update_guest") {
      const guest = await updateGuestByToken(params.token, body.guest || {});
      return NextResponse.json({ guest });
    }

    if (action === "create_memory") {
      const message = String(body.message || "").trim();
      if (!message) return NextResponse.json({ error: "Escreva um depoimento antes de enviar." }, { status: 400 });
      const memory = await createMemory(params.token, message);
      return NextResponse.json({ memory });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
