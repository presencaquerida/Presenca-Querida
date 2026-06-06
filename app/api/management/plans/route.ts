import { NextResponse } from "next/server";
import { createPromotion, getAllAcquisitionPlans, getPromotions, upsertAcquisitionPlan } from "@/lib/data";
import { requireAccess } from "@/lib/auth";

export async function GET(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });
  const [plans, promotions] = await Promise.all([getAllAcquisitionPlans(), getPromotions()]);
  return NextResponse.json({ plans, promotions });
}

export async function POST(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });

  try {
    const body = await request.json();
    if (body.action === "save_plan") {
      const plan = await upsertAcquisitionPlan({
        slug: body.slug,
        name: body.name,
        tag: body.tag,
        description: body.description,
        idealFor: body.idealFor,
        referencePrice: body.referencePrice,
        founderPrice: body.founderPrice,
        founderSlotsTotal: Number(body.founderSlotsTotal || 5),
        founderSlotsUsed: Number(body.founderSlotsUsed || 0),
        isActive: body.isActive !== false,
        sortOrder: Number(body.sortOrder || 50),
        features: String(body.features || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        ctaLabel: body.ctaLabel
      });
      return NextResponse.json({ plan });
    }

    if (body.action === "create_promotion") {
      const promotion = await createPromotion({
        planSlug: body.planSlug || null,
        title: body.title,
        description: body.description,
        slotsTotal: Number(body.slotsTotal || 5),
        slotsUsed: Number(body.slotsUsed || 0),
        isActive: body.isActive !== false
      });
      return NextResponse.json({ promotion });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
