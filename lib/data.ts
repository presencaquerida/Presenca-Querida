import { demoBundle } from "./demo-data";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { slugifyToken } from "./status";
import type { ContractItem, EventBundle, EventInfo, Guest, GuestGroup, GuestStatus, MemoryItem, MessageTemplate, SalesItem, TaskItem } from "./types";

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
