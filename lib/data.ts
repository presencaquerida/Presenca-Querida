import { demoBundle } from "./demo-data";
import { getSupabaseAdmin } from "./supabaseAdmin";
import type { EventBundle, EventInfo, Guest, GuestGroup, MessageTemplate, TaskItem } from "./types";

function toEventInfo(row: any): EventInfo {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    honoreeFullName: row.honoree_full_name,
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
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    tone: row.tone
  };
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
    companionsAdults: row.companions_adults ?? 0,
    companionsChildren: row.companions_children ?? 0,
    dietaryNotes: row.dietary_notes ?? "",
    notes: row.notes ?? "",
    lastMessageStage: row.last_message_stage ?? "",
    updatedAt: row.updated_at
  };
}

function toMessage(row: any): MessageTemplate {
  return {
    id: row.id,
    eventId: row.event_id,
    stage: row.stage,
    audience: row.audience,
    title: row.title,
    body: row.body
  };
}

function toTask(row: any): TaskItem {
  return {
    id: row.id,
    eventId: row.event_id,
    title: row.title,
    category: row.category,
    status: row.status,
    dueDate: row.due_date
  };
}

export async function getEventBundle(slug: string): Promise<EventBundle | null> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return slug === demoBundle.event.slug ? demoBundle : null;
  }

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventError || !eventRow) {
    return slug === demoBundle.event.slug ? demoBundle : null;
  }

  const [groupsResult, guestsResult, messagesResult, tasksResult] = await Promise.all([
    supabase.from("guest_groups").select("*").eq("event_id", eventRow.id).order("name"),
    supabase.from("guests").select("*").eq("event_id", eventRow.id).order("full_name"),
    supabase.from("message_templates").select("*").eq("event_id", eventRow.id).order("stage"),
    supabase.from("tasks").select("*").eq("event_id", eventRow.id).order("due_date")
  ]);

  if (groupsResult.error || guestsResult.error || messagesResult.error || tasksResult.error) {
    throw new Error("Erro ao carregar dados do Supabase.");
  }

  return {
    event: toEventInfo(eventRow),
    groups: (groupsResult.data ?? []).map(toGroup),
    guests: (guestsResult.data ?? []).map(toGuest),
    messageTemplates: (messagesResult.data ?? []).map(toMessage),
    tasks: (tasksResult.data ?? []).map(toTask)
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

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .select("slug")
    .eq("id", guestRow.event_id)
    .single();

  if (eventError || !eventRow) return null;

  const bundle = await getEventBundle(eventRow.slug);
  if (!bundle) return null;

  return { bundle, guest: toGuest(guestRow) };
}

export async function updateGuestByToken(token: string, payload: Partial<Guest>): Promise<Guest | null> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    const guest = demoBundle.guests.find((item) => item.token === token);
    if (!guest) return null;
    return {
      ...guest,
      status: payload.status ?? guest.status,
      companionsAdults: Number(payload.companionsAdults ?? guest.companionsAdults),
      companionsChildren: Number(payload.companionsChildren ?? guest.companionsChildren),
      dietaryNotes: String(payload.dietaryNotes ?? guest.dietaryNotes),
      notes: String(payload.notes ?? guest.notes),
      updatedAt: new Date().toISOString()
    };
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  if (payload.status) updatePayload.status = payload.status;
  if (payload.companionsAdults !== undefined) updatePayload.companions_adults = Number(payload.companionsAdults);
  if (payload.companionsChildren !== undefined) updatePayload.companions_children = Number(payload.companionsChildren);
  if (payload.dietaryNotes !== undefined) updatePayload.dietary_notes = payload.dietaryNotes;
  if (payload.notes !== undefined) updatePayload.notes = payload.notes;
  if (payload.status === "confirmed") updatePayload.confirmed_at = new Date().toISOString();
  if (payload.status === "declined") updatePayload.confirmed_at = null;

  const { data, error } = await supabase.from("guests").update(updatePayload).eq("token", token).select("*").single();

  if (error || !data) {
    throw new Error(error?.message ?? "Erro ao atualizar convidado.");
  }

  return toGuest(data);
}
