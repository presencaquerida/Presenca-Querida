"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import type { Profile } from "@/lib/types";

type SupabaseProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "gestao" | "cliente";
  event_slug: string | null;
  active: boolean | null;
};

function toProfile(row: SupabaseProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? "",
    fullName: row.full_name ?? "",
    role: row.role,
    eventSlug: row.event_slug,
    active: Boolean(row.active)
  };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setMessage("Login indisponível: configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.session || !data.user) {
        setMessage(error?.message || "Não foi possível entrar. Confira e-mail e senha.");
        return;
      }

      let profile: Profile | null = null;

      try {
        const profileResponse = await fetchWithTimeout("/api/me/profile", {
          headers: { Authorization: `Bearer ${data.session.access_token}` }
        });

        if (profileResponse.ok) {
          profile = (await profileResponse.json()) as Profile;
        }
      } catch {
        // tenta fallback pelo próprio Supabase abaixo
      }

      if (!profile) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("id,email,full_name,role,event_slug,active")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileRow) profile = toProfile(profileRow as SupabaseProfileRow);
      }

      if (!profile) {
        setMessage("Login feito, mas este e-mail ainda não está vinculado a um perfil do Presença Querida. Rode o SQL 03_profiles_usuarios.sql ou peça à gestão para liberar o acesso.");
        await supabase.auth.signOut();
        return;
      }

      if (!profile.active) {
        setMessage("Este acesso está inativo. Peça à gestão para reativar o usuário.");
        await supabase.auth.signOut();
        return;
      }

      window.location.assign(profile.role === "gestao" ? "/gestao" : `/cliente/${profile.eventSlug || "daniela-50"}`);
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      setMessage(isAbort ? "O login demorou para responder. Tente novamente em alguns instantes." : "Não foi possível concluir o login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageShell narrowShell">
      <section className="panel authPanel">
        <span className="kicker">Acesso seguro</span>
        <h1>Acesso para quem já é cliente</h1>
        <p>Entre com o e-mail cadastrado para acessar seu evento, importar convidados, revisar mensagens e acompanhar confirmações.</p>
        <form className="formGrid" onSubmit={handleLogin}>
          <input type="email" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <button className="btn btnPrimary" disabled={loading} type="submit">{loading ? "Entrando..." : "Entrar"}</button>
        </form>
        {message ? <div className="notice danger"><strong>{message}</strong></div> : null}
        <Link href="/recuperar-senha">Esqueci minha senha / trocar senha</Link>
      </section>
    </div>
  );
}
