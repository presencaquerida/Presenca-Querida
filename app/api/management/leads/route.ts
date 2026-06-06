import { NextResponse } from "next/server";
import { requireAccess } from "@/lib/auth";
import { getLeadDiagnostics } from "@/lib/data";

export async function GET(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });
  const leads = await getLeadDiagnostics();
  return NextResponse.json({ leads });
}
