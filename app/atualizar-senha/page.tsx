"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AtualizarSenhaPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage("Configure o Supabase para ativar troca de senha.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Senha atualizada com sucesso. Você já pode entrar.");
  }

  return (
    <div className="pageShell narrowShell">
      <section className="panel authPanel">
        <span className="kicker">Nova senha</span>
        <h1>Atualizar senha</h1>
        <form className="formGrid" onSubmit={handleUpdate}>
          <input type="password" minLength={6} placeholder="Nova senha" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="btn btnPrimary" type="submit">Salvar nova senha</button>
        </form>
        {message ? <div className="notice success"><strong>{message}</strong></div> : null}
        <Link href="/login">Ir para login</Link>
      </section>
    </div>
  );
}
