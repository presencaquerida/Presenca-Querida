import { NextResponse } from "next/server";
import { getGuestByToken, updateGuestByToken } from "@/lib/data";
import type { GuestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const allowedStatuses: GuestStatus[] = ["confirmed", "maybe", "declined"];

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const result = await getGuestByToken(params.token);

  if (!result) {
    return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ event: result.bundle.event, guest: result.guest });
}

export async function PATCH(request: Request, { params }: { params: { token: string } }) {
  try {
    const body = await request.json();
    const status = body.status as GuestStatus;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    const updatedGuest = await updateGuestByToken(params.token, {
      status,
      companionsAdults: Number(body.companionsAdults ?? 0),
      companionsChildren: Number(body.companionsChildren ?? 0),
      dietaryNotes: String(body.dietaryNotes ?? "").slice(0, 500),
      notes: String(body.notes ?? "").slice(0, 1000)
    });

    if (!updatedGuest) {
      return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ guest: updatedGuest });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao salvar resposta." }, { status: 500 });
  }
}
