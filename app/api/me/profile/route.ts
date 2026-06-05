import { NextResponse } from "next/server";
import { getProfileFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const profile = await getProfileFromRequest(request);
  if (!profile) return NextResponse.json({ error: "Perfil não encontrado." }, { status: 401 });
  return NextResponse.json(profile);
}
