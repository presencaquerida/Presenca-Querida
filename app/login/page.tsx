"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import type { Profile } from "@/lib/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o login.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setMessage(error?.message || "Não foi possível entrar.");
      setLoading(false);
      return;
    }
    const profileResponse = await fetch("/api/me/profile", { headers: { Authorization: `Bearer ${data.session.access_token}` } });
    if (!profileResponse.ok) {
      setMessage("Login feito, mas o perfil ainda não foi configurado. Rode o SQL de profiles no Supabase.");
      setLoading(false);
      return;
    }
    const profile = (await profileResponse.json()) as Profile;
    window.location.href = profile.role === "gestao" ? "/gestao" : `/cliente/${profile.eventSlug || "daniela-50"}`;
  }

  return (
    <div className="pageShell narrowShell">
      <section className="panel authPanel">
        <span className="kicker">Acesso seguro</span>
        <h1>Entrar no Presença Querida</h1>
        <p>Use o e-mail cadastrado no Supabase. A gestão vê todos os clientes. O cliente vê apenas o próprio evento.</p>
        <form className="formGrid" onSubmit={handleLogin}>
          <input type="email" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input type="password" placeholder="Senha" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="btn btnPrimary" disabled={loading} type="submit">{loading ? "Entrando..." : "Entrar"}</button>
        </form>
        {message ? <div className="notice danger"><strong>{message}</strong></div> : null}
        <Link href="/recuperar-senha">Esqueci minha senha / trocar senha</Link>
      </section>
    </div>
  );
}
