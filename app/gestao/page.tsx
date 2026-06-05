"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { renderMessage } from "@/lib/messages";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { normalizePhoneForWhatsApp, statusLabels, statusTone } from "@/lib/status";
import type { EventBundle, Guest, GuestStatus, MessageTemplate, Profile } from "@/lib/types";

type Filter = "all" | GuestStatus;

export default function GestaoPage() {
  const [bundle, setBundle] = useState<EventBundle | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getAccessHeaders() {
    const supabase = getSupabaseBrowser();
    const headers: Record<string, string> = {};
    if (adminToken) headers["x-admin-token"] = adminToken;
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) headers.Authorization = `Bearer ${data.session.access_token}`;
    }
    return headers;
  }

  async function load(tokenOverride?: string) {
    setError("");
    const tokenToUse = tokenOverride ?? adminToken;
    const headers = await getAccessHeaders();
    if (tokenToUse) headers["x-admin-token"] = tokenToUse;
    const response = await fetch("/api/admin/daniela-50", { cache: "no-store", headers });
    if (response.status === 401) {
      setError("Faça login como gestão ou informe o token de emergência ADMIN_ACCESS_TOKEN.");
      setBundle(null);
      return;
    }
    if (!response.ok) {
      setError("Não foi possível carregar a gestão.");
      setBundle(null);
      return;
    }
    const data = (await response.json()) as EventBundle;
    setBundle(data);
    setSelectedGuestId((current) => current || data.guests[0]?.id || "");
    setSelectedTemplateId((current) => current || data.messageTemplates[0]?.id || "");
  }

  useEffect(() => {
    async function boot() {
      const stored = window.localStorage.getItem("presenca_querida_admin_token") ?? "";
      setAdminToken(stored);
      const supabase = getSupabaseBrowser();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          const response = await fetch("/api/me/profile", { headers: { Authorization: `Bearer ${data.session.access_token}` } });
          if (response.ok) setProfile((await response.json()) as Profile);
        }
      }
      setAuthChecked(true);
      await load(stored);
    }
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveTokenAndLoad() {
    window.localStorage.setItem("presenca_querida_admin_token", adminToken);
    load(adminToken);
  }

  const summary = useMemo(() => {
    const guests = bundle?.guests ?? [];
    const confirmedGuests = guests.filter((guest) => guest.status === "confirmed");
    return {
      total: guests.length,
      confirmed: confirmedGuests.length,
      maybe: guests.filter((guest) => guest.status === "maybe").length,
      declined: guests.filter((guest) => guest.status === "declined").length,
      pending: guests.filter((guest) => ["pending", "save_date_sent", "invited"].includes(guest.status)).length,
      people: confirmedGuests.reduce((sum, guest) => sum + guest.companionsAdults + guest.companionsChildren, 0)
    };
  }, [bundle]);

  const filteredGuests = useMemo(() => {
    const guests = bundle?.guests ?? [];
    return filter === "all" ? guests : guests.filter((guest) => guest.status === filter);
  }, [bundle, filter]);

  const selectedGuest = bundle?.guests.find((guest) => guest.id === selectedGuestId) ?? null;
  const selectedTemplate = bundle?.messageTemplates.find((template) => template.id === selectedTemplateId) ?? null;
  const renderedMessage = bundle && selectedGuest && selectedTemplate
    ? renderMessage(selectedTemplate, bundle.event, selectedGuest, typeof window !== "undefined" ? window.location.origin : undefined)
    : "";

  function openWhatsApp(guest: Guest, template: MessageTemplate) {
    const phone = normalizePhoneForWhatsApp(guest.phone);
    const text = renderMessage(template, bundle!.event, guest, window.location.origin);
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function approveMemory(id: string, approved: boolean) {
    setMessage("");
    const headers = await getAccessHeaders();
    const response = await fetch("/api/admin/daniela-50", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ action: "approve_memory", id, isApproved: approved })
    });
    if (!response.ok) {
      setMessage("Não foi possível atualizar o depoimento.");
      return;
    }
    setMessage("Depoimento atualizado.");
    await load();
  }

  if (authChecked && !profile && getSupabaseBrowser() && !adminToken && error) {
    return (
      <div className="pageShell">
        <section className="panel authPanel">
          <span className="kicker">Área gestão</span>
          <h1>Entre como gestão.</h1>
          <p>Use o usuário presencaquerida@gmail.com ou o token de emergência durante implantação.</p>
          <div className="actions">
            <Link className="btn btnPrimary" href="/login">Entrar</Link>
          </div>
          <div className="formGrid tokenBox">
            <input value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder="Token de emergência" />
            <button className="btn btnSecondary" type="button" onClick={saveTokenAndLoad}>Usar token</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pageShell">
      <section className="sectionBlock managementHero">
        <div>
          <span className="kicker">Gestão Presença Querida</span>
          <h1>Funil, cliente, contrato e operação em um só painel.</h1>
          <p className="lead">A gestão enxerga todos os clientes e também consegue apoiar a operação que o cliente vê: convidados, mensagens, confirmações e pós-evento.</p>
        </div>
        <div className="tokenBox">
          <input value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder="Token de emergência" />
          <button className="btn btnSecondary" type="button" onClick={saveTokenAndLoad}>Salvar token</button>
        </div>
      </section>

      {error ? <div className="notice danger"><strong>{error}</strong></div> : null}
      {message ? <div className="notice success"><strong>{message}</strong></div> : null}

      {bundle ? (
        <>
          <section className="metricGrid compactMetrics">
            <MetricCard label="Convites" value={summary.total} helper="Total cadastrado" />
            <MetricCard label="Confirmados" value={summary.confirmed} helper={`${summary.people} pessoas previstas`} />
            <MetricCard label="Pendentes" value={summary.pending} helper="Precisam de ação" />
            <MetricCard label="Talvez / não" value={`${summary.maybe}/${summary.declined}`} helper="Acompanhar" />
          </section>

          <section className="sectionBlock twoColumns">
            <article className="panel">
              <span className="kicker">Funil comercial</span>
              <h2>Clientes e oportunidades</h2>
              <div className="stack">
                {bundle.sales.map((item) => (
                  <div className="listCard" key={item.id}>
                    <strong>{item.name}</strong>
                    <span>{item.stage}</span>
                    <p>{item.nextStep}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="panel">
              <span className="kicker">Contrato e pós-venda</span>
              <h2>Implantação e recorrência</h2>
              <div className="stack">
                {bundle.contracts.map((item) => (
                  <div className="listCard" key={item.id}>
                    <strong>{item.clientName}</strong>
                    <span>{item.plan} · {item.status}</span>
                    <p>{item.monthlyValue}</p>
                  </div>
                ))}
                {bundle.tasks.map((task) => (
                  <div className="listCard" key={task.id}>
                    <strong>{task.title}</strong>
                    <span>{task.category} · {task.dueDate}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="sectionBlock">
            <span className="kicker">Mensagens WhatsApp</span>
            <h2>Gerar texto por convidado e fase</h2>
            <div className="panel formGrid">
              <div className="twoMini">
                <select value={selectedGuestId} onChange={(event) => setSelectedGuestId(event.target.value)}>
                  {bundle.guests.map((guest) => <option key={guest.id} value={guest.id}>{guest.fullName}</option>)}
                </select>
                <select value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}>
                  {bundle.messageTemplates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
                </select>
              </div>
              <div className="messageBox">{renderedMessage}</div>
              <div className="actions">
                {selectedGuest && selectedTemplate ? <button className="btn btnPrimary" type="button" onClick={() => openWhatsApp(selectedGuest, selectedTemplate)}>Abrir WhatsApp</button> : null}
                <a className="btn btnSecondary" href="/modelos/convidados-modelo.csv" download>Baixar modelo CSV</a>
              </div>
            </div>
          </section>

          <section className="sectionBlock">
            <span className="kicker">Operação do cliente</span>
            <h2>Convidados e status</h2>
            <div className="filterBar">
              {(["all", "pending", "save_date_sent", "invited", "confirmed", "maybe", "declined"] as Filter[]).map((item) => (
                <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "all" ? "Todos" : statusLabels[item]}</button>
              ))}
            </div>
            <div className="tableWrap">
              <table>
                <thead><tr><th>Convidado</th><th>Invite</th><th>Status</th><th>Link</th><th>WhatsApp</th></tr></thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td><strong>{guest.fullName}</strong><br /><small>{guest.notes}</small></td>
                      <td>{guest.invitedNames.join(", ")}</td>
                      <td><span className={`statusPill ${statusTone[guest.status]}`}>{statusLabels[guest.status]}</span></td>
                      <td><Link href={`/convite/${guest.token}`}>/convite/{guest.token}</Link></td>
                      <td>{guest.phone || "Sem número"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sectionBlock">
            <span className="kicker">Pós-evento e mural</span>
            <h2>Depoimentos enviados pelos convidados</h2>
            <div className="grid">
              {bundle.memories.map((item) => (
                <article className="card" key={item.id}>
                  <h3>{item.guestName}</h3>
                  <p>{item.message}</p>
                  <span className={`statusPill ${item.isApproved ? "tone-success" : "tone-warning"}`}>{item.isApproved ? "Aprovado" : "Aguardando aprovação"}</span>
                  <div className="actions">
                    <button className="btn btnSecondary" type="button" onClick={() => approveMemory(item.id, !item.isApproved)}>{item.isApproved ? "Ocultar" : "Aprovar"}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
