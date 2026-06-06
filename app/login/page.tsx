"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

type LoginResponse = {
  error?: string;
  redirectTo?: string;
  session?: {
    access_token: string;
    refresh_token: string;
  };
};

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 16000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    window.clearTimeout(timeout);
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(`${label} demorou demais para responder.`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
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
    if (loading) return;

    setLoading(true);
    setMessage("Autenticando acesso...");

    try {
      const response = await fetchWithTimeout(
        "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password })
        },
        18000
      );

      const result = (await response.json().catch(() => ({ error: "Resposta inválida do servidor." }))) as LoginResponse;

      if (!response.ok || result.error) {
        setMessage(result.error || "Não foi possível entrar. Confira e-mail e senha.");
        setLoading(false);
        return;
      }

      if (!result.redirectTo || !result.session?.access_token || !result.session?.refresh_token) {
        setMessage("Login feito, mas a resposta de sessão veio incompleta. Tente novamente.");
        setLoading(false);
        return;
      }

      setMessage("Login confirmado. Abrindo sua área...");

      const supabase = getSupabaseBrowser();
      if (supabase) {
        await withTimeout(
          supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token
          }),
          7000,
          "Gravação da sessão"
        );
      }

      window.location.replace(result.redirectTo);
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      const message = error instanceof Error ? error.message : "Erro inesperado no login.";
      setMessage(isAbort ? "O login demorou para responder. Confira a internet e tente novamente." : message);
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
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <button className="btn btnPrimary" disabled={loading} type="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {message ? (
          <div className={loading ? "notice" : "notice danger"}>
            <strong>{message}</strong>
          </div>
        ) : null}
        <Link href="/recuperar-senha">Esqueci minha senha / trocar senha</Link>
      </section>
    </div>
  );
}
