"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { formatDateBR, formatTime, statusLabels, statusTone } from "@/lib/status";
import type { EventBundle, Guest, Profile } from "@/lib/types";

type NewGuestForm = {
  fullName: string;
  shortName: string;
  phone: string;
  groupName: string;
  invitedNames: string;
  maxCompanionsAdults: string;
  maxCompanionsChildren: string;
  notes: string;
};

const emptyGuest: NewGuestForm = {
  fullName: "",
  shortName: "",
  phone: "",
  groupName: "Família e amigos",
  invitedNames: "",
  maxCompanionsAdults: "0",
  maxCompanionsChildren: "0",
  notes: ""
};

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(";").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(";");
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index]?.trim() ?? "";
      return acc;
    }, {});
  });
}

export default function ClienteDanielaPage() {
  const [bundle, setBundle] = useState<EventBundle | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [guestForm, setGuestForm] = useState<NewGuestForm>(emptyGuest);
  const [message, setMessage] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  async function getToken() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return "";
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  }

  async function load() {
    setMessage("");
    const token = await getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await fetch("/api/admin/daniela-50?scope=cliente", { cache: "no-store", headers });
    if (!response.ok) {
      setBundle(null);
      return;
    }
    setBundle((await response.json()) as EventBundle);
  }

  useEffect(() => {
    async function checkAuth() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setAuthChecked(true);
        await load();
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        const profileResponse = await fetch("/api/me/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (profileResponse.ok) setProfile((await profileResponse.json()) as Profile);
      }
      setAuthChecked(true);
      await load();
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const guests = bundle?.guests ?? [];
    return {
      guests: guests.length,
      confirmed: guests.filter((guest) => guest.status === "confirmed").length,
      pending: guests.filter((guest) => ["pending", "save_date_sent", "invited"].includes(guest.status)).length,
      memories: bundle?.memories.filter((item) => item.isApproved).length ?? 0
    };
  }, [bundle]);

  async function createGuest(form: NewGuestForm) {
    const token = await getToken();
    const response = await fetch("/api/admin/daniela-50", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        action: "create_guest",
        guest: {
          fullName: form.fullName,
          shortName: form.shortName || form.fullName.split(" ")[0],
          phone: form.phone,
          groupName: form.groupName,
          invitedNames: form.invitedNames.split(/[;,]/).map((item) => item.trim()).filter(Boolean),
          maxCompanionsAdults: Number(form.maxCompanionsAdults || 0),
          maxCompanionsChildren: Number(form.maxCompanionsChildren || 0),
          notes: form.notes
        }
      })
    });
    if (!response.ok) throw new Error("Erro ao salvar convidado.");
  }

  async function handleManualGuest(event: React.FormEvent) {
    event.preventDefault();
    if (!guestForm.fullName.trim()) {
      setMessage("Informe o nome principal do convite.");
      return;
    }
    try {
      await createGuest(guestForm);
      setGuestForm(emptyGuest);
      setMessage("Convidado incluído com sucesso.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao incluir convidado.");
    }
  }

  async function handleCsv(file: File) {
    const text = await file.text();
    const rows = parseCsv(text);
    if (!rows.length) {
      setMessage("Modelo vazio ou fora do padrão. Use o arquivo CSV disponível para download.");
      return;
    }
    let count = 0;
    for (const row of rows) {
      if (!row.nome_principal) continue;
      await createGuest({
        fullName: row.nome_principal,
        shortName: row.nome_curto || row.nome_principal.split(" ")[0],
        phone: row.telefone || "",
        groupName: row.grupo || "Família e amigos",
        invitedNames: row.convidados_no_mesmo_convite || row.nome_principal,
        maxCompanionsAdults: row.limite_acompanhantes_adultos || "0",
        maxCompanionsChildren: row.limite_acompanhantes_criancas || "0",
        notes: row.observacoes || ""
      });
      count += 1;
    }
    setMessage(`${count} convite(s) importado(s).`);
    await load();
  }

  if (authChecked && !profile && getSupabaseBrowser()) {
    return (
      <div className="pageShell">
        <section className="panel authPanel">
          <span className="kicker">Área do cliente</span>
          <h1>Acesse para gerenciar a festa.</h1>
          <p>Use o login da cliente para importar convidados, validar mensagens e atualizar dados do evento.</p>
          <Link className="btn btnPrimary" href="/login">Entrar</Link>
        </section>
      </div>
    );
  }

  if (!bundle) return <div className="pageShell"><div className="panel">Carregando...</div></div>;
  const { event } = bundle;

  return (
    <div className="pageShell">
      <section className="hero clientHero">
        <div className="heroCopy">
          <span className="eyebrow">Área cliente · {event.honoreeFullName}</span>
          <h1>{event.title}</h1>
          <p className="lead">{event.headline}</p>
          <p>{event.description}</p>
          <div className="actions">
            <a className="btn btnPrimary" href="/modelos/convidados-modelo.csv" download>Baixar modelo CSV</a>
            <Link className="btn btnSecondary" href="/convite/ana-silva-dani50">Ver convite exemplo</Link>
          </div>
        </div>
        <aside className="impactCard honoreeCard">
          <Image src={event.honoreePhotoUrl || "/daniela-placeholder.svg"} alt={event.honoreeFullName} width={520} height={520} className="honoreePhoto" />
          <div>
            <h2>{event.honoreeFullName}</h2>
            <p>{formatDateBR(event.eventDate)} · {formatTime(event.startTime)} às {formatTime(event.endTime)}</p>
            <p><strong>{event.locationName}</strong> · {event.theme}</p>
          </div>
        </aside>
      </section>

      <section className="metricGrid compactMetrics">
        <MetricCard label="Convites" value={summary.guests} helper="Total na lista" />
        <MetricCard label="Confirmados" value={summary.confirmed} helper="Já responderam sim" />
        <MetricCard label="Pendentes" value={summary.pending} helper="Precisam de lembrete" />
        <MetricCard label="Depoimentos" value={summary.memories} helper="Aprovados para mural" />
      </section>

      {message ? <div className="notice success"><strong>{message}</strong></div> : null}

      <section className="sectionBlock twoColumns">
        <article className="panel">
          <span className="kicker">Importação</span>
          <h2>Importar lista de convidados</h2>
          <p>Preencha o modelo CSV. Use ponto e vírgula para separar os nomes quando o mesmo invite tiver duas ou mais pessoas.</p>
          <input type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] ? handleCsv(event.target.files[0]) : undefined} />
        </article>

        <article className="panel">
          <span className="kicker">Inclusão manual</span>
          <h2>Novo invite</h2>
          <form className="formGrid" onSubmit={handleManualGuest}>
            <input placeholder="Nome principal" value={guestForm.fullName} onChange={(e) => setGuestForm({ ...guestForm, fullName: e.target.value })} />
            <input placeholder="Nome curto para mensagem" value={guestForm.shortName} onChange={(e) => setGuestForm({ ...guestForm, shortName: e.target.value })} />
            <input placeholder="WhatsApp" value={guestForm.phone} onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })} />
            <input placeholder="Grupo" value={guestForm.groupName} onChange={(e) => setGuestForm({ ...guestForm, groupName: e.target.value })} />
            <textarea placeholder="Nomes no mesmo convite. Ex.: Marcos; Paula; Lucas" value={guestForm.invitedNames} onChange={(e) => setGuestForm({ ...guestForm, invitedNames: e.target.value })} />
            <div className="twoMini">
              <input type="number" min="0" placeholder="Acompanhantes adultos" value={guestForm.maxCompanionsAdults} onChange={(e) => setGuestForm({ ...guestForm, maxCompanionsAdults: e.target.value })} />
              <input type="number" min="0" placeholder="Acompanhantes crianças" value={guestForm.maxCompanionsChildren} onChange={(e) => setGuestForm({ ...guestForm, maxCompanionsChildren: e.target.value })} />
            </div>
            <textarea placeholder="Observações" value={guestForm.notes} onChange={(e) => setGuestForm({ ...guestForm, notes: e.target.value })} />
            <button className="btn btnPrimary" type="submit">Salvar convidado</button>
          </form>
        </article>
      </section>

      <section className="sectionBlock">
        <span className="kicker">Convidados</span>
        <h2>Lista dinâmica de invites</h2>
        <div className="tableWrap">
          <table>
            <thead><tr><th>Nome</th><th>Invite inclui</th><th>Status</th><th>Link</th><th>Observações</th></tr></thead>
            <tbody>
              {bundle.guests.map((guest: Guest) => (
                <tr key={guest.id}>
                  <td><strong>{guest.fullName}</strong><br /><small>{guest.phone || "Sem WhatsApp"}</small></td>
                  <td>{guest.invitedNames.join(", ") || guest.fullName}</td>
                  <td><span className={`statusPill ${statusTone[guest.status]}`}>{statusLabels[guest.status]}</span></td>
                  <td><Link href={`/convite/${guest.token}`}>Abrir convite</Link></td>
                  <td>{guest.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
