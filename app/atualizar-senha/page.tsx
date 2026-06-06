"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AtualizarSenhaPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage("Configure o Supabase para ativar troca de senha.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const token = sessionData.session?.access_token;
    if (token) {
      await fetch("/api/me/mark-password-updated", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => undefined);
    }

    setMessage("Senha atualizada com sucesso. Você já pode acessar sua área.");
    setLoading(false);
  }

  return (
    <div className="pageShell narrowShell">
      <section className="panel authPanel">
        <span className="kicker">Nova senha</span>
        <h1>Atualizar senha</h1>
        <p>Crie uma senha própria para proteger seu acesso ao Presença Querida.</p>
        <form className="formGrid" onSubmit={handleUpdate}>
          <div className="passwordField">
            <input type={showPassword ? "text" : "password"} minLength={6} placeholder="Nova senha" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="button" onClick={() => setShowPassword((current) => !current)}>{showPassword ? "Ocultar" : "Mostrar"}</button>
          </div>
          <button className="btn btnPrimary" type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</button>
        </form>
        {message ? <div className="notice success"><strong>{message}</strong></div> : null}
        <Link href="/login">Ir para login</Link>
      </section>
    </div>
  );
}
