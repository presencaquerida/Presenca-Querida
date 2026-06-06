import { NextResponse } from "next/server";
import { createLeadDiagnostic } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ["name", "whatsapp", "eventType", "guestCount", "hasGuestList", "interestPlan", "needsHelp", "messageTone", "urgency"];
    const missing = required.filter((field) => !String(body[field] || "").trim());
    if (missing.length) {
      return NextResponse.json({ error: "Preencha os campos principais do diagnóstico." }, { status: 400 });
    }

    const lead = await createLeadDiagnostic({
      name: String(body.name || ""),
      whatsapp: String(body.whatsapp || ""),
      email: String(body.email || ""),
      eventType: String(body.eventType || ""),
      eventDate: String(body.eventDate || ""),
      guestCount: String(body.guestCount || ""),
      hasGuestList: String(body.hasGuestList || ""),
      interestPlan: String(body.interestPlan || ""),
      needsHelp: String(body.needsHelp || ""),
      messageTone: String(body.messageTone || ""),
      urgency: String(body.urgency || ""),
      notes: String(body.notes || ""),
      source: String(body.source || "diagnostico")
    });

    return NextResponse.json({ lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao enviar diagnóstico.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
