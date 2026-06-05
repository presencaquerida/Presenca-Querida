import { getSupabaseAdmin } from "./supabaseAdmin";
import type { Profile, UserRole } from "./types";

type AccessResult = {
  allowed: boolean;
  reason?: string;
  profile?: Profile;
  role?: UserRole;
};

function toProfile(row: any): Profile {
  return {
    id: row.id,
    email: row.email ?? "",
    fullName: row.full_name ?? "",
    role: row.role,
    eventSlug: row.event_slug,
    active: Boolean(row.active)
  };
}

export async function getProfileFromRequest(request: Request): Promise<Profile | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!bearer) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser(bearer);
  if (userError || !userData.user) return null;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profileRow) return null;
  return toProfile(profileRow);
}

export async function requireAccess(request: Request, options: { role?: UserRole; eventSlug?: string } = {}): Promise<AccessResult> {
  const supabase = getSupabaseAdmin();

  const requiredToken = process.env.ADMIN_ACCESS_TOKEN;
  const headerToken = request.headers.get("x-admin-token");
  if (requiredToken && requiredToken !== "troque-este-token" && headerToken === requiredToken) {
    return { allowed: true, role: "gestao" };
  }

  if (!supabase) {
    return { allowed: true, role: options.role ?? "gestao" };
  }

  const profile = await getProfileFromRequest(request);
  if (!profile || !profile.active) {
    return { allowed: false, reason: "Faça login novamente." };
  }

  if (profile.role === "gestao") {
    return { allowed: true, profile, role: "gestao" };
  }

  if (options.role === "gestao") {
    return { allowed: false, reason: "Acesso restrito à gestão." };
  }

  if (options.eventSlug && profile.eventSlug && profile.eventSlug !== options.eventSlug) {
    return { allowed: false, reason: "Este cliente não tem acesso a este evento." };
  }

  return { allowed: true, profile, role: "cliente" };
}
