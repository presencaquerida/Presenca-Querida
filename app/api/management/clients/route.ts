import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAccess } from "@/lib/auth";
import { createClientAndEvent, getClients, type CreateClientPayload } from "@/lib/data";

function randomPassword() {
  return `PQ-${Math.random().toString(36).slice(2, 8)}-${Math.random().toString(36).slice(2, 8)}!`;
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function GET(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });
  const clients = await getClients();
  return NextResponse.json({ clients });
}

export async function POST(request: Request) {
  const access = await requireAccess(request, { role: "gestao" });
  if (!access.allowed) return NextResponse.json({ error: access.reason || "Acesso restrito à gestão." }, { status: 403 });

  try {
    const body = await request.json();
    const payload: CreateClientPayload = {
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim().toLowerCase(),
      phone: String(body.phone || "").trim(),
      planSlug: String(body.planSlug || "").trim() || undefined,
      eventSlug: String(body.eventSlug || "").trim().toLowerCase(),
      eventTitle: String(body.eventTitle || "").trim(),
      honoreeFullName: String(body.honoreeFullName || "").trim(),
      eventDate: String(body.eventDate || "").trim(),
      startTime: String(body.startTime || "19:00").trim(),
      endTime: String(body.endTime || "23:00").trim(),
      locationName: String(body.locationName || "A definir").trim(),
      theme: String(body.theme || "").trim(),
      status: "cliente_fundador"
    };

    if (!payload.name || !payload.email || !payload.eventSlug || !payload.eventTitle || !payload.honoreeFullName || !payload.eventDate) {
      return NextResponse.json({ error: "Preencha nome, e-mail, evento, pessoa homenageada e data." }, { status: 400 });
    }

    const { client, event } = await createClientAndEvent(payload);
    const supabase = getSupabaseAdmin();
    let inviteMessage = "Cliente e evento criados. Configure o Supabase para gerar o acesso.";
    let temporaryPassword = "";
    let resetLink = `${getSiteUrl()}/recuperar-senha`;

    if (supabase) {
      temporaryPassword = randomPassword();
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: payload.email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: { full_name: payload.name, event_slug: payload.eventSlug, must_change_password: true }
      });

      let userId = created.user?.id;
      if (createError && !createError.message.toLowerCase().includes("already")) {
        throw new Error(createError.message);
      }

      if (!userId) {
        const { data: users } = await supabase.auth.admin.listUsers();
        userId = users.users.find((item) => item.email?.toLowerCase() === payload.email)?.id;
      }

      if (!userId) throw new Error("Cliente criado, mas não foi possível localizar/criar o usuário no Auth.");

      await supabase.from("profiles").upsert({
        id: userId,
        email: payload.email,
        full_name: payload.name,
        role: "cliente",
        event_slug: payload.eventSlug,
        active: true,
        must_change_password: true
      }, { onConflict: "id" });

      await supabase.auth.admin.generateLink({
        type: "recovery",
        email: payload.email,
        options: { redirectTo: `${getSiteUrl()}/atualizar-senha` }
      }).then(({ data }) => {
        resetLink = data.properties?.action_link || resetLink;
      }).catch(() => undefined);

      inviteMessage = "Cliente criado com perfil correto. Envie a senha temporária e o link de troca de senha abaixo para o cliente.";
    }

    return NextResponse.json({ client, event, temporaryPassword, resetLink, inviteMessage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado ao criar cliente.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
