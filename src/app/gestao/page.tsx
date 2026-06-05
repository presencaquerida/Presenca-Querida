"use client";

import { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { renderMessage } from "@/lib/messages";
import { normalizePhoneForWhatsApp, statusLabels, statusTone } from "@/lib/status";
import type { EventBundle, Guest, MessageTemplate, GuestStatus } from "@/lib/types";

type Filter = "all" | GuestStatus;

export default function GestaoPage() {
  const [bundle, setBundle] = useState<EventBundle | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(tokenOverride?: string) {
    setLoading(true);
    setError("");
    const token = tokenOverride ?? adminToken;
    const response = await fetch("/api/admin/daniela-50", {
      cache: "no-store",
      headers: token ? { "x-admin-token": token } : undefined
    });
    if (response.status === 401) {
      setError("Informe o token de gestão configurado em ADMIN_ACCESS_TOKEN.");
      setLoading(false);
      return;
    }
    if (!response.ok) {
      setError("Não foi possível carregar a gestão.");
      setLoading(false);
      return;
    }
    const data = (await response.json()) as EventBundle;
    setBundle(data);
    setSelectedGuestId(data.guests[0]?.id ?? "");
    setSelectedTemplateId(data.messageTemplates[0]?.id ?? "");
    setLoading(false);
  }

  useEffect(() => {
    const stored = window.localStorage.getItem("presenca_querida_admin_token") ?? "";
    setAdminToken(stored);
    load(stored);
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
      people: confirmedGuests.reduce((sum, guest) => sum + 1 + guest.companionsAdults + guest.companionsChildren, 0)
    };
  }, [bundle]);

  const filteredGuests = useMemo(() => {
    const guests = bundle?.guests ?? [];
    return filter === "all" ? guests : guests.filter((guest) => guest.status === filter);
  }, [bundle, filter]);

  const selectedGuest = bundle?.guests.find((guest) => guest.id === selectedGuestId) ?? null;
  const selectedTemplate = bundle?.messageTemplates.find((template) => template.id === selectedTemplateId) ?? null;
  const renderedMessage = bundle && selectedGuest && selectedTemplate
    ? renderMessage(selectedTemplate, bundle.event, selectedGuest, window.location.origin)
    : "";

  function openWhatsApp(guest: Guest, template: MessageTemplate) {
    if (!bundle) return;
    const text = renderMessage(template, bundle.event, guest, window.location.origin);
    const phone = normalizePhoneForWhatsApp(guest.phone);
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  async function downloadCsv() {
    const response = await fetch("/api/admin/daniela-50/export", {
      headers: adminToken ? { "x-admin-token": adminToken } : undefined
    });
    if (!response.ok) {
      alert("Não foi possível exportar. Confira o token de gestão.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presenca-querida-daniela-50-convidados.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <section className="panel stack">
        <div>
          <span className="kicker">Gestão</span>
          <h1>Painel Daniela 50</h1>
          <p className="lead">Controle de convidados, mensagens por fase, pendências e estimativa para buffet.</p>
        </div>
        <div className="field">
          <label htmlFor="token">Token de gestão</label>
          <input id="token" type="password" value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder="ADMIN_ACCESS_TOKEN" />
        </div>
        <div className="actions">
          <button className="btn btnPrimary" onClick={saveTokenAndLoad} disabled={loading}>{loading ? "Carregando..." : "Carregar gestão"}</button>
          <button className="btn btnSecondary" onClick={downloadCsv} disabled={!bundle}>Exportar CSV</button>
        </div>
        {error ? <div className="notice danger">{error}</div> : null}
      </section>

      {bundle ? (
        <>
          <section className="sectionTitle">
            <span className="kicker">Resumo</span>
            <h2>Visão rápida da presença.</h2>
          </section>
          <div className="metricGrid">
            <MetricCard label="Convidados" value={summary.total} />
            <MetricCard label="Confirmados" value={summary.confirmed} />
            <MetricCard label="Pessoas previstas" value={summary.people} hint="inclui acompanhantes" />
            <MetricCard label="Pendentes" value={summary.pending} />
          </div>

          <section className="sectionTitle">
            <span className="kicker">Mensagens Deep Dive</span>
            <h2>Palavra certa, na hora certa, para a pessoa certa.</h2>
          </section>
          <div className="grid">
            <div className="panel stack">
              <div className="field">
                <label>Convidado</label>
                <select value={selectedGuestId} onChange={(event) => setSelectedGuestId(event.target.value)}>
                  {bundle.guests.map((guest) => <option key={guest.id} value={guest.id}>{guest.fullName}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Modelo de mensagem</label>
                <select value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}>
                  {bundle.messageTemplates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
                </select>
              </div>
              <button className="btn btnPink" disabled={!selectedGuest || !selectedTemplate} onClick={() => selectedGuest && selectedTemplate && openWhatsApp(selectedGuest, selectedTemplate)}>Abrir no WhatsApp</button>
            </div>
            <div className="panel stack" style={{ gridColumn: "span 2" }}>
              <h3>Prévia da mensagem</h3>
              <div className="messageBox">{renderedMessage}</div>
            </div>
          </div>

          <section className="sectionTitle">
            <span className="kicker">Convidados</span>
            <h2>Status e acompanhamento.</h2>
          </section>
          <div className="actions">
            {(["all", "pending", "confirmed", "maybe", "declined"] as Filter[]).map((item) => (
              <button key={item} className={`btn ${filter === item ? "btnPrimary" : "btnSecondary"}`} onClick={() => setFilter(item)}>
                {item === "all" ? "Todos" : statusLabels[item]}
              </button>
            ))}
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Acompanhantes</th>
                  <th>Observações</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td><strong>{guest.fullName}</strong><br /><small>{guest.shortName}</small></td>
                    <td><span className={`statusPill tone-${statusTone[guest.status]}`}>{statusLabels[guest.status]}</span></td>
                    <td>{guest.status === "confirmed" ? `${guest.companionsAdults} adulto(s), ${guest.companionsChildren} criança(s)` : "—"}</td>
                    <td>{guest.dietaryNotes || guest.notes || "—"}</td>
                    <td><a href={`/convite/${guest.token}`} target="_blank">Abrir convite</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
