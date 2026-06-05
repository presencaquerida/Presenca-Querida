import { NextResponse } from "next/server";
import { createMemory, getGuestByToken, updateGuestByToken } from "@/lib/data";
import type { GuestStatus } from "@/lib/types";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const data = await getGuestByToken(params.token);
  if (!data) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: { params: { token: string } }) {
  const body = await request.json();
  const allowedStatuses: GuestStatus[] = ["confirmed", "maybe", "declined"];
  if (!allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }
  const updated = await updateGuestByToken(params.token, {
    status: body.status,
    companionsAdults: Number(body.companionsAdults ?? 0),
    companionsChildren: Number(body.companionsChildren ?? 0),
    dietaryNotes: String(body.dietaryNotes ?? ""),
    notes: String(body.notes ?? "")
  });
  if (!updated) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  const body = await request.json();
  const message = String(body.memory ?? "").trim();
  if (message.length < 8) return NextResponse.json({ error: "Depoimento muito curto." }, { status: 400 });
  const memory = await createMemory(params.token, message);
  if (!memory) return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  return NextResponse.json(memory);
}
