import { demoBundle } from "./demo-data";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { slugifyToken } from "./status";
import type { AcquisitionPlan, ClientItem, ContractItem, EventBundle, EventInfo, Guest, GuestGroup, GuestStatus, MemoryItem, MessageTemplate, PromotionItem, SalesItem, TaskItem } from "./types";

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function toEventInfo(row: any): EventInfo {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    honoreeFullName: row.honoree_full_name,
    honoreePhotoUrl: row.honoree_photo_url || "/daniela-placeholder.svg",
    headline: row.headline,
    description: row.description,
    eventDate: row.event_date,
    startTime: row.start_time?.slice(0, 5) ?? "",
    endTime: row.end_time?.slice(0, 5) ?? "",
    locationName: row.location_name,
    locationUrl: row.location_url,
    address: row.address,
    bandName: row.band_name,
    bandUrl: row.band_url,
    bandStartTime: row.band_start_time?.slice(0, 5) ?? "",
    bandEndTime: row.band_end_time?.slice(0, 5) ?? "",
    buffetName: row.buffet_name,
    buffetUrl: row.buffet_url,
    isSurprise: Boolean(row.is_surprise),
    theme: row.theme,
    privacyNote: row.privacy_note
  };
}

function toGroup(row: any): GuestGroup {
  return { id: row.id, eventId: row.event_id, name: row.name, tone: row.tone };
}

function toGuest(row: any): Guest {
  return {
    id: row.id,
    eventId: row.event_id,
    groupId: row.group_id,
    fullName: row.full_name,
    shortName: row.short_name,
    phone: row.phone ?? "",
    token: row.token,
    status: row.status,
    invitedNames: asStringArray(row.invited_names).length ? asStringArray(row.invited_names) : [row.full_name].filter(Boolean),
    maxCompanionsAdults: row.max_companions_adults ?? 0,
    maxCompanionsChildren: row.max_companions_children ?? 0,
    companionsAdults: row.companions_adults ?? 0,
    companionsChildren: row.companions_children ?? 0,
    dietaryNotes: row.dietary_notes ?? "",
    notes: row.notes ?? "",
    lastMessageStage: row.last_message_stage ?? "",
    updatedAt: row.updated_at
  };
}

function toMessage(row: any): MessageTemplate {
  return { id: row.id, eventId: row.event_id, stage: row.stage, audience: row.audience, title: row.title, body: row.body };
}

function toTask(row: any): TaskItem {
  return { id: row.id, eventId: row.event_id, title: row.title, category: row.category, status: row.status, dueDate: row.due_date };
}

function toMemory(row: any): MemoryItem {
  return {
    id: row.id,
    eventId: row.event_id,
    guestId: row.guest_id,
    guestName: row.guest_name,
    message: row.message,
    isApproved: Boolean(row.is_approved),
    createdAt: row.created_at
  };
}

function toSales(row: any): SalesItem {
  return { id: row.id, name: row.name, stage: row.stage, nextStep: row.next_step, owner: row.owner };
}

function toContract(row: any): ContractItem {
  return { id: row.id, clientName: row.client_name, plan: row.plan, status: row.status, monthlyValue: row.monthly_value };
}


export const fallbackAcquisitionPlans: AcquisitionPlan[] = [
  {
    id: "plan-essencial",
    slug: "essencial",
    name: "Essencial",
    tag: "Cliente opera",
    description: "Página do evento, confirmação de presença, lista de convidados, link individual e painel simples.",
    idealFor: "Festas pequenas e familiares.",
    referencePrice: "R$ 297",
    founderPrice: "Sem custo",
    founderSlotsTotal: 5,
    founderSlotsUsed: 0,
    isActive: true,
    sortOrder: 1,
    features: ["Convite digital com identidade", "Links individuais", "Painel de confirmados e pendentes"],
    ctaLabel: "Quero ser cliente fundador"
  },
  {
    id: "plan-organizado",
    slug: "organizado",
    name: "Organizado",
    tag: "Mais controle",
    description: "Importação de convidados, grupos, mensagens por fase, controle de pendentes, exportação e histórico.",
    idealFor: "Aniversários, bodas e eventos com muitas confirmações.",
    referencePrice: "R$ 597",
    founderPrice: "Sem custo",
    founderSlotsTotal: 5,
    founderSlotsUsed: 0,
    isActive: true,
    sortOrder: 2,
    features: ["Importação por CSV", "Grupos de convidados", "Mensagens prontas por etapa"],
    ctaLabel: "Quero ser cliente fundador"
  },
  {
    id: "plan-memoravel",
    slug: "memoravel",
    name: "Memorável",
    tag: "Mais carinho",
    description: "História da pessoa, foto da aniversariante, recados, depoimentos, agradecimento e galeria pós-evento.",
    idealFor: "50, 60, 70 anos, bodas e festas surpresa.",
    referencePrice: "R$ 1.197",
    founderPrice: "Sem custo",
    founderSlotsTotal: 5,
    founderSlotsUsed: 0,
    isActive: true,
    sortOrder: 3,
    features: ["Página afetiva da pessoa", "Mural de recados", "Memória pós-evento"],
    ctaLabel: "Quero ser cliente fundador"
  },
  {
    id: "plan-assistido",
    slug: "assistido",
    name: "Assistido",
    tag: "AE apoia operação",
    description: "A Automação Extrema ajuda na configuração, mensagens, acompanhamento dos pendentes e relatório final.",
    idealFor: "Famílias que querem cuidado sem operar o sistema.",
    referencePrice: "R$ 1.997",
    founderPrice: "Sem custo",
    founderSlotsTotal: 5,
    founderSlotsUsed: 0,
    isActive: true,
    sortOrder: 4,
    features: ["Configuração assistida", "Apoio em mensagens", "Relatório final"],
    ctaLabel: "Quero ser cliente fundador"
  }
];

function toAcquisitionPlan(row: any): AcquisitionPlan {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tag: row.tag ?? "",
    description: row.description ?? "",
    idealFor: row.ideal_for ?? "",
    referencePrice: row.reference_price ?? "",
    founderPrice: row.founder_price ?? "Sem custo",
    founderSlotsTotal: Number(row.founder_slots_total ?? 0),
    founderSlotsUsed: Number(row.founder_slots_used ?? 0),
    isActive: Boolean(row.is_active),
    sortOrder: Number(row.sort_order ?? 0),
    features: asStringArray(row.features),
    ctaLabel: row.cta_label ?? "Quero este formato"
  };
}

function toClientItem(row: any): ClientItem {
  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    status: row.status ?? "lead",
    planSlug: row.plan_slug ?? null,
    eventSlug: row.event_slug ?? null,
    createdAt: row.created_at ?? ""
  };
}

function toPromotionItem(row: any): PromotionItem {
  return {
    id: row.id,
    planSlug: row.plan_slug ?? null,
    title: row.title ?? "",
    description: row.description ?? "",
    slotsTotal: Number(row.slots_total ?? 0),
    slotsUsed: Number(row.slots_used ?? 0),
    isActive: Boolean(row.is_active)
  };
}

export async function getAcquisitionPlans(): Promise<AcquisitionPlan[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackAcquisitionPlans;

  const { data, error } = await supabase
    .from("acquisition_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackAcquisitionPlans;
  return data.map(toAcquisitionPlan);
}

export async function getAllAcquisitionPlans(): Promise<AcquisitionPlan[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackAcquisitionPlans;

  const { data, error } = await supabase.from("acquisition_plans").select("*").order("sort_order", { ascending: true });
  if (error || !data?.length) return fallbackAcquisitionPlans;
  return data.map(toAcquisitionPlan);
}

export async function upsertAcquisitionPlan(payload: Partial<AcquisitionPlan>): Promise<AcquisitionPlan> {
  const supabase = getSupabaseAdmin();
  const slug = (payload.slug || slugifyToken(payload.name || "plano")).toLowerCase();

  if (!supabase) {
    return { ...fallbackAcquisitionPlans[0], ...payload, id: slug, slug, features: payload.features || [] } as AcquisitionPlan;
  }

  const upsertPayload = {
    slug,
    name: payload.name || slug,
    tag: payload.tag || "",
    description: payload.description || "",
    ideal_for: payload.idealFor || "",
    reference_price: payload.referencePrice || "",
    founder_price: payload.founderPrice || "Sem custo",
    founder_slots_total: payload.founderSlotsTotal ?? 5,
    founder_slots_used: payload.founderSlotsUsed ?? 0,
    is_active: payload.isActive ?? true,
    sort_order: payload.sortOrder ?? 50,
    features: payload.features || [],
    cta_label: payload.ctaLabel || "Quero este formato"
  };

  const { data, error } = await supabase.from("acquisition_plans").upsert(upsertPayload, { onConflict: "slug" }).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao salvar plano.");
  return toAcquisitionPlan(data);
}

export async function getClients(): Promise<ClientItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(toClientItem);
}

export async function getPromotions(): Promise<PromotionItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(toPromotionItem);
}

export async function createPromotion(payload: Partial<PromotionItem>): Promise<PromotionItem> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { id: `promo-${Date.now()}`, planSlug: payload.planSlug ?? null, title: payload.title || "Promoção", description: payload.description || "", slotsTotal: payload.slotsTotal ?? 5, slotsUsed: 0, isActive: true };
  }
  const insertPayload = {
    plan_slug: payload.planSlug || null,
    title: payload.title || "Programa Cliente Fundador",
    description: payload.description || "",
    slots_total: payload.slotsTotal ?? 5,
    slots_used: payload.slotsUsed ?? 0,
    is_active: payload.isActive ?? true
  };
  const { data, error } = await supabase.from("promotions").insert(insertPayload).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao salvar promoção.");
  return toPromotionItem(data);
}

export async function getEventBundle(slug: string): Promise<EventBundle | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return slug === demoBundle.event.slug ? demoBundle : null;

  const { data: eventRow, error: eventError } = await supabase.from("events").select("*").eq("slug", slug).single();
  if (eventError || !eventRow) return slug === demoBundle.event.slug ? demoBundle : null;

  const [groupsResult, guestsResult, messagesResult, tasksResult, memoriesResult, salesResult, contractsResult] = await Promise.all([
    supabase.from("guest_groups").select("*").eq("event_id", eventRow.id).order("name"),
    supabase.from("guests").select("*").eq("event_id", eventRow.id).order("full_name"),
    supabase.from("message_templates").select("*").eq("event_id", eventRow.id).order("stage"),
    supabase.from("tasks").select("*").eq("event_id", eventRow.id).order("due_date"),
    supabase.from("guest_memories").select("*").eq("event_id", eventRow.id).order("created_at", { ascending: false }),
    supabase.from("sales_pipeline").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("contracts").select("*").order("created_at", { ascending: false }).limit(20)
  ]);

  if (groupsResult.error || guestsResult.error || messagesResult.error || tasksResult.error) throw new Error("Erro ao carregar dados do Supabase.");

  return {
    event: toEventInfo(eventRow),
    groups: (groupsResult.data ?? []).map(toGroup),
    guests: (guestsResult.data ?? []).map(toGuest),
    messageTemplates: (messagesResult.data ?? []).map(toMessage),
    tasks: (tasksResult.data ?? []).map(toTask),
    memories: memoriesResult.error ? [] : (memoriesResult.data ?? []).map(toMemory),
    sales: salesResult.error ? [] : (salesResult.data ?? []).map(toSales),
    contracts: contractsResult.error ? [] : (contractsResult.data ?? []).map(toContract)
  };
}

export async function getGuestByToken(token: string): Promise<{ bundle: EventBundle; guest: Guest } | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const guest = demoBundle.guests.find((item) => item.token === token);
    return guest ? { bundle: demoBundle, guest } : null;
  }

  const { data: guestRow, error } = await supabase.from("guests").select("*").eq("token", token).single();
  if (error || !guestRow) {
    const demoGuest = demoBundle.guests.find((item) => item.token === token);
    return demoGuest ? { bundle: demoBundle, guest: demoGuest } : null;
  }

  const { data: eventRow, error: eventError } = await supabase.from("events").select("slug").eq("id", guestRow.event_id).single();
  if (eventError || !eventRow) return null;
  const bundle = await getEventBundle(eventRow.slug);
  return bundle ? { bundle, guest: toGuest(guestRow) } : null;
}

export async function updateGuestByToken(token: string, payload: Partial<Guest>): Promise<Guest | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const guest = demoBundle.guests.find((item) => item.token === token);
    if (!guest) return null;
    return { ...guest, ...payload, updatedAt: new Date().toISOString() };
  }

  const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (payload.status) updatePayload.status = payload.status;
  if (payload.invitedNames) updatePayload.invited_names = payload.invitedNames;
  if (payload.companionsAdults !== undefined) updatePayload.companions_adults = Number(payload.companionsAdults);
  if (payload.companionsChildren !== undefined) updatePayload.companions_children = Number(payload.companionsChildren);
  if (payload.maxCompanionsAdults !== undefined) updatePayload.max_companions_adults = Number(payload.maxCompanionsAdults);
  if (payload.maxCompanionsChildren !== undefined) updatePayload.max_companions_children = Number(payload.maxCompanionsChildren);
  if (payload.dietaryNotes !== undefined) updatePayload.dietary_notes = payload.dietaryNotes;
  if (payload.notes !== undefined) updatePayload.notes = payload.notes;
  if (payload.phone !== undefined) updatePayload.phone = payload.phone;
  if (payload.fullName !== undefined) updatePayload.full_name = payload.fullName;
  if (payload.shortName !== undefined) updatePayload.short_name = payload.shortName;
  if (payload.status === "confirmed") updatePayload.confirmed_at = new Date().toISOString();
  if (payload.status === "declined") updatePayload.confirmed_at = null;

  const { data, error } = await supabase.from("guests").update(updatePayload).eq("token", token).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao atualizar convidado.");
  return toGuest(data);
}


export type CreateClientPayload = {
  name: string;
  email: string;
  phone?: string;
  planSlug?: string;
  eventSlug: string;
  eventTitle: string;
  honoreeFullName: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  theme?: string;
  status?: string;
};

export async function createClientAndEvent(payload: CreateClientPayload): Promise<{ client: ClientItem; event: EventInfo }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const now = new Date().toISOString();
    return {
      client: { id: payload.eventSlug, name: payload.name, email: payload.email, phone: payload.phone || "", status: payload.status || "cliente_fundador", planSlug: payload.planSlug || null, eventSlug: payload.eventSlug, createdAt: now },
      event: {
        ...demoBundle.event,
        id: payload.eventSlug,
        slug: payload.eventSlug,
        title: payload.eventTitle,
        honoreeFullName: payload.honoreeFullName,
        eventDate: payload.eventDate,
        startTime: payload.startTime || "19:00",
        endTime: payload.endTime || "23:00",
        locationName: payload.locationName || "",
        theme: payload.theme || ""
      }
    };
  }

  const eventPayload = {
    slug: payload.eventSlug,
    title: payload.eventTitle,
    honoree_full_name: payload.honoreeFullName,
    honoree_photo_url: "/daniela-placeholder.svg",
    headline: `Celebração de ${payload.honoreeFullName}`,
    description: "Evento criado pela Gestão do Presença Querida.",
    event_date: payload.eventDate,
    start_time: payload.startTime || "19:00",
    end_time: payload.endTime || "23:00",
    location_name: payload.locationName || "A definir",
    theme: payload.theme || "A definir"
  };

  const { data: eventRow, error: eventError } = await supabase.from("events").upsert(eventPayload, { onConflict: "slug" }).select("*").single();
  if (eventError || !eventRow) throw new Error(eventError?.message ?? "Erro ao criar evento.");

  const clientPayload = {
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone || "",
    status: payload.status || "cliente_fundador",
    plan_slug: payload.planSlug || null,
    event_slug: payload.eventSlug
  };

  const { data: clientRow, error: clientError } = await supabase.from("clients").upsert(clientPayload, { onConflict: "email" }).select("*").single();
  if (clientError || !clientRow) throw new Error(clientError?.message ?? "Erro ao criar cliente.");

  await supabase.from("sales_pipeline").insert({
    name: payload.name,
    stage: "Cliente fundador",
    next_step: "Enviar acesso, configurar evento e validar lista de convidados.",
    owner: "Presença Querida"
  });

  await supabase.from("contracts").insert({
    client_name: payload.name,
    plan: payload.planSlug || "a definir",
    status: "Acesso criado",
    monthly_value: "Cliente fundador"
  });

  return { client: toClientItem(clientRow), event: toEventInfo(eventRow) };
}

export async function createGuest(slug: string, payload: Partial<Guest> & { groupName?: string }): Promise<Guest> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const token = payload.token || `${slugifyToken(payload.fullName || "convidado")}-${Date.now().toString(36)}`;
    return {
      id: token,
      eventId: demoBundle.event.id,
      groupId: null,
      fullName: payload.fullName || "Novo convidado",
      shortName: payload.shortName || payload.fullName || "Convidado",
      phone: payload.phone || "",
      token,
      status: payload.status || "pending",
      invitedNames: payload.invitedNames || [payload.fullName || "Convidado"],
      maxCompanionsAdults: payload.maxCompanionsAdults ?? 0,
      maxCompanionsChildren: payload.maxCompanionsChildren ?? 0,
      companionsAdults: payload.companionsAdults ?? 0,
      companionsChildren: payload.companionsChildren ?? 0,
      dietaryNotes: payload.dietaryNotes || "",
      notes: payload.notes || "",
      lastMessageStage: payload.lastMessageStage || "",
      updatedAt: new Date().toISOString()
    };
  }

  const { data: eventRow, error: eventError } = await supabase.from("events").select("id").eq("slug", slug).single();
  if (eventError || !eventRow) throw new Error("Evento não encontrado.");

  let groupId: string | null = payload.groupId ?? null;
  if (!groupId && payload.groupName) {
    const { data: groupRow, error: groupError } = await supabase
      .from("guest_groups")
      .upsert({ event_id: eventRow.id, name: payload.groupName, tone: "carinhoso" }, { onConflict: "event_id,name" })
      .select("id")
      .single();
    if (!groupError && groupRow) groupId = groupRow.id;
  }

  const baseToken = payload.token || `${slugifyToken(payload.fullName || "convidado")}-${Math.random().toString(36).slice(2, 7)}`;
  const insertPayload = {
    event_id: eventRow.id,
    group_id: groupId,
    full_name: payload.fullName || "Novo convidado",
    short_name: payload.shortName || payload.fullName || "Convidado",
    phone: payload.phone || "",
    token: baseToken,
    status: payload.status || "pending",
    invited_names: payload.invitedNames || [payload.fullName || "Convidado"],
    max_companions_adults: payload.maxCompanionsAdults ?? 0,
    max_companions_children: payload.maxCompanionsChildren ?? 0,
    companions_adults: payload.companionsAdults ?? 0,
    companions_children: payload.companionsChildren ?? 0,
    dietary_notes: payload.dietaryNotes || "",
    notes: payload.notes || "",
    last_message_stage: payload.lastMessageStage || ""
  };

  const { data, error } = await supabase.from("guests").insert(insertPayload).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao criar convidado.");
  return toGuest(data);
}

export async function createMemory(token: string, message: string): Promise<MemoryItem | null> {
  const match = await getGuestByToken(token);
  if (!match) return null;
  const { bundle, guest } = match;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { id: `memory-${Date.now()}`, eventId: bundle.event.id, guestId: guest.id, guestName: guest.shortName || guest.fullName, message, isApproved: false, createdAt: new Date().toISOString() };
  }

  const { data, error } = await supabase
    .from("guest_memories")
    .insert({ event_id: bundle.event.id, guest_id: guest.id, guest_name: guest.shortName || guest.fullName, message, is_approved: false })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao salvar depoimento.");
  return toMemory(data);
}

export async function updateEvent(slug: string, payload: Partial<EventInfo>): Promise<EventInfo | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ...demoBundle.event, ...payload };

  const updatePayload: Record<string, unknown> = {};
  if (payload.title !== undefined) updatePayload.title = payload.title;
  if (payload.headline !== undefined) updatePayload.headline = payload.headline;
  if (payload.description !== undefined) updatePayload.description = payload.description;
  if (payload.honoreePhotoUrl !== undefined) updatePayload.honoree_photo_url = payload.honoreePhotoUrl;
  if (payload.locationName !== undefined) updatePayload.location_name = payload.locationName;
  if (payload.address !== undefined) updatePayload.address = payload.address;
  if (payload.privacyNote !== undefined) updatePayload.privacy_note = payload.privacyNote;

  const { data, error } = await supabase.from("events").update(updatePayload).eq("slug", slug).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao atualizar evento.");
  return toEventInfo(data);
}

export async function updateMessageTemplate(id: string, body: string): Promise<MessageTemplate | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return demoBundle.messageTemplates.find((item) => item.id === id) ?? null;
  const { data, error } = await supabase.from("message_templates").update({ body }).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao atualizar mensagem.");
  return toMessage(data);
}

export async function updateMemoryApproval(id: string, isApproved: boolean): Promise<MemoryItem | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return demoBundle.memories.find((item) => item.id === id) ?? null;
  const { data, error } = await supabase.from("guest_memories").update({ is_approved: isApproved }).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erro ao atualizar depoimento.");
  return toMemory(data);
}
