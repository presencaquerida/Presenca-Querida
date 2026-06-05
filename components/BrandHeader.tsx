"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import type { Profile } from "@/lib/types";

export function BrandHeader() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    async function loadProfile() {
      const { data: sessionData } = await supabase!.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        setProfile(null);
        return;
      }
      const response = await fetch("/api/me/profile", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        setProfile(null);
        return;
      }
      const data = (await response.json()) as Profile;
      setProfile(data);
    }

    loadProfile();
    const { data: listener } = supabase.auth.onAuthStateChange(() => loadProfile());
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    window.location.href = "/";
  }

  return (
    <header className="brandHeader">
      <div className="brandTopRow">
        <Link href="/" className="brandIdentity" aria-label="Página inicial do Presença Querida">
          <Image src="/logo-presenca-querida.svg" alt="Presença Querida" className="brandMark" width={58} height={58} priority />
          <strong>Presença Querida</strong>
        </Link>

        <nav className="brandNav" aria-label="Navegação principal">
          <Link href="/cliente/daniela-50">Cliente</Link>
          <Link href="/gestao">Gestão</Link>
          {profile ? (
            <button className="navButton" type="button" onClick={signOut}>Sair</button>
          ) : null}
        </nav>

        <a className="devStrip" href="https://automacaoextrema.com" target="_blank" rel="noreferrer">
          <strong>Desenvolvido por</strong>
          <Image src="/ae-logo.png" alt="Automação Extrema" className="devLogo" width={228} height={53} />
          <span>Clique no logo e nos conheça</span>
        </a>
      </div>
    </header>
  );
}
