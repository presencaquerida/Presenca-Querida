import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { Profile } from "@/lib/types";

type LoginBody = {
  email?: string;
  password?: string;
  expectedRole?: "gestao" | "cliente";
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "gestao" | "cliente";
  event_slug: string | null;
  active: boolean | null;
  must_change_password?: boolean | null;
};

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? "",
    fullName: row.full_name ?? "",
    role: row.role,
    eventSlug: row.event_slug,
    active: Boolean(row.active),
    mustChangePassword: Boolean(row.must_change_password)
  };
}

function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes("SEU-PROJETO")) {
    return null;
  }

  return { url, anonKey };
}

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} demorou demais para responder.`)), timeoutMs);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function findProfile(userId: string, accessToken: string): Promise<{ profile: Profile | null; error?: string }> {
  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await withTimeout(
      admin
        .from("profiles")
        .select("id,email,full_name,role,event_slug,active,must_change_password")
        .eq("id", userId)
        .maybeSingle(),
      9000,
      "Busca do perfil"
    );

    if (error) return { profile: null, error: error.message };
    return { profile: data ? toProfile(data as ProfileRow) : null };
  }

  const config = getSupabasePublicConfig();
  if (!config) return { profile: null, error: "Supabase não configurado." };

  const authenticatedClient = createClient(config.url, config.anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await withTimeout(
    authenticatedClient
      .from("profiles")
      .select("id,email,full_name,role,event_slug,active,must_change_password")
      .eq("id", userId)
      .maybeSingle(),
    9000,
    "Busca do perfil"
  );

  if (error) return { profile: null, error: error.message };
  return { profile: data ? toProfile(data as ProfileRow) : null };
}

export async function POST(request: Request) {
  try {
    const config = getSupabasePublicConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Supabase não configurado. Confira NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no Vercel." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const expectedRole = body.expectedRole;

    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    const authClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await withTimeout(
      authClient.auth.signInWithPassword({ email, password }),
      12000,
      "Autenticação"
    );

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Não foi possível entrar. Confira e-mail e senha." },
        { status: 401 }
      );
    }

    const { profile, error: profileError } = await findProfile(data.user.id, data.session.access_token);

    if (!profile) {
      return NextResponse.json(
        {
          error: profileError
            ? `Login feito, mas houve erro ao buscar o perfil: ${profileError}`
            : "Login feito, mas este e-mail ainda não tem perfil no Presença Querida. Rode o SQL 03_profiles_usuarios.sql."
        },
        { status: 403 }
      );
    }

    if (!profile.active) {
      return NextResponse.json({ error: "Este acesso está inativo. Peça à gestão para reativar o usuário." }, { status: 403 });
    }

    if (expectedRole && profile.role !== expectedRole) {
      return NextResponse.json(
        { error: expectedRole === "gestao" ? "Este e-mail não tem perfil de gestão." : "Este e-mail não tem perfil de cliente." },
        { status: 403 }
      );
    }

    const redirectTo = profile.mustChangePassword ? "/atualizar-senha" : (profile.role === "gestao" ? "/gestao" : `/cliente/${profile.eventSlug || "daniela-50"}`);

    return NextResponse.json({
      profile,
      redirectTo,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado no login.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
