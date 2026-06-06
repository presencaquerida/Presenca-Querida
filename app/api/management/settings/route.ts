import { NextResponse } from "next/server";
import { requireAccess } from "@/lib/auth";
import { getSiteSettings, upsertSiteSettings } from "@/lib/data";

export async function GET(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });

  try {
    const body = await request.json();
    const settings = await upsertSiteSettings({
      solutionName: String(body.solutionName || "").trim(),
      solutionDescription: String(body.solutionDescription || "").trim(),
      aeSiteUrl: String(body.aeSiteUrl || "").trim(),
      whatsappNumber: String(body.whatsappNumber || "").replace(/\D/g, ""),
      instagramUrl: String(body.instagramUrl || "").trim(),
      facebookUrl: String(body.facebookUrl || "").trim(),
      tiktokUrl: String(body.tiktokUrl || "").trim(),
      youtubeUrl: String(body.youtubeUrl || "").trim(),
      footerNote: String(body.footerNote || "").trim()
    });
    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar configurações.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
