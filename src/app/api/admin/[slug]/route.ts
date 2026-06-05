import { NextResponse } from "next/server";
import { hasAdminAccess } from "@/lib/admin";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  const bundle = await getEventBundle(params.slug);

  if (!bundle) {
    return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  }

  return NextResponse.json(bundle);
}
