"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage("Configure o Supabase para ativar recuperação de senha.");
      return;
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/atualizar-senha` });
    setMessage(error ? error.message : "Enviamos o link de troca de senha para o e-mail informado.");
  }

  return (
    <div className="pageShell narrowShell">
      <section className="panel authPanel">
        <span className="kicker">Troca de senha</span>
        <h1>Recuperar acesso</h1>
        <form className="formGrid" onSubmit={handleReset}>
          <input type="email" placeholder="E-mail cadastrado" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <button className="btn btnPrimary" type="submit">Enviar link</button>
        </form>
        {message ? <div className="notice success"><strong>{message}</strong></div> : null}
        <Link href="/login">Voltar ao login</Link>
      </section>
    </div>
  );
}
