import { NextResponse } from "next/server";
import { createMemory, getGuestByToken, updateGuestByToken } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const match = await getGuestByToken(params.token);
  if (!match) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  return NextResponse.json(match);
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  try {
    if (body?.action === "save_memory") {
      const memoryMessage = String(body.message || "").trim();
      if (!memoryMessage) return NextResponse.json({ error: "Informe o depoimento antes de enviar." }, { status: 400 });
      const memory = await createMemory(params.token, memoryMessage);
      return NextResponse.json({ ok: true, memory });
    }

    const guest = await updateGuestByToken(params.token, {
      status: body.status,
      companionsAdults: Number(body.companionsAdults ?? 0),
      companionsChildren: Number(body.companionsChildren ?? 0),
      dietaryNotes: body.dietaryNotes ?? "",
      notes: body.notes ?? ""
    });

    if (!guest) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
    return NextResponse.json({ ok: true, guest });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao salvar resposta." }, { status: 500 });
  }
}
