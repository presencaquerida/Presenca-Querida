"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDateBR, formatTime, statusLabels, statusTone } from "@/lib/status";
import type { EventBundle, Guest, GuestStatus } from "@/lib/types";

type ApiResponse = { bundle: EventBundle; guest: Guest } | { error: string };

export default function ConvitePage({ params }: { params: { token: string } }) {
  const [bundle, setBundle] = useState<EventBundle | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [status, setStatus] = useState<GuestStatus>("pending");
  const [adults, setAdults] = useState("0");
  const [children, setChildren] = useState("0");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [memory, setMemory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await fetch(`/api/guests/${params.token}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => ({ error: "Convite inválido." }))) as ApiResponse;
      if (!response.ok || "error" in payload) {
        setMessage("Convite não encontrado. Confira o link recebido.");
        setLoading(false);
        return;
      }
      setBundle(payload.bundle);
      setGuest(payload.guest);
      setStatus(payload.guest.status);
      setAdults(String(payload.guest.companionsAdults || 0));
      setChildren(String(payload.guest.companionsChildren || 0));
      setDietaryNotes(payload.guest.dietaryNotes || "");
      setLoading(false);
    }
    load();
  }, [params.token]);

  const event = bundle?.event;
  const inviteNames = useMemo(() => guest?.invitedNames?.length ? guest.invitedNames.join(", ") : guest?.fullName, [guest]);

  async function saveConfirmation() {
    if (!guest) return;
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/guests/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_guest",
        guest: {
          status,
          companionsAdults: Number(adults || 0),
          companionsChildren: Number(children || 0),
          dietaryNotes
        }
      })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(payload?.error || "Não foi possível salvar sua resposta.");
      setSaving(false);
      return;
    }
    setGuest(payload.guest);
    setMessage("Resposta registrada com carinho. Obrigado por confirmar!");
    setSaving(false);
  }

  async function sendMemory() {
    if (!memory.trim()) {
      setMessage("Escreva uma lembrança antes de enviar.");
      return;
    }
    setSaving(true);
    const response = await fetch(`/api/guests/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_memory", message: memory })
    });
    const payload = await response.json().catch(() => null);
    setSaving(false);
    if (!response.ok) {
      setMessage(payload?.error || "Não foi possível enviar a lembrança.");
      return;
    }
    setMemory("");
    setMessage("Lembrança enviada. A família poderá aprovar antes de publicar no mural.");
  }

  if (loading) return <div className="pageShell"><section className="panel">Carregando convite...</section></div>;

  if (!event || !guest) {
    return <div className="pageShell"><section className="panel"><h1>Convite não encontrado</h1><p>{message}</p><Link className="btn btnSecondary" href="/">Voltar</Link></section></div>;
  }

  return (
    <div className="pageShell">
      <section className="hero clientHero">
        <div className="heroCopy">
          <span className="eyebrow">Convite separado com carinho</span>
          <h1>{event.title}</h1>
          <p className="lead">Oi, {guest.shortName || guest.fullName}. Este convite está em nome de: <strong>{inviteNames}</strong>.</p>
          <p>{event.description}</p>
          <p><strong>{formatDateBR(event.eventDate)}</strong> · {formatTime(event.startTime)} às {formatTime(event.endTime)} · {event.locationName}</p>
          {event.isSurprise ? <div className="notice"><strong>É surpresa:</strong> por favor, ajude a manter este carinho em segredo.</div> : null}
        </div>
        <aside className="impactCard honoreeCard">
          <Image src={event.honoreePhotoUrl || "/daniela-placeholder.svg"} alt={event.honoreeFullName} width={520} height={520} className="honoreePhoto" />
          <div>
            <h2>{event.honoreeFullName}</h2>
            <p>{event.theme}</p>
            <span className={`statusPill ${statusTone[guest.status]}`}>{statusLabels[guest.status]}</span>
          </div>
        </aside>
      </section>

      <section className="sectionBlock twoColumns">
        <article className="panel formGrid">
          <span className="kicker">Confirmação de presença</span>
          <h2>Você poderá participar?</h2>
          <div className="segmented">
            <button type="button" className={status === "confirmed" ? "active" : ""} onClick={() => setStatus("confirmed")}>Sim</button>
            <button type="button" className={status === "maybe" ? "active" : ""} onClick={() => setStatus("maybe")}>Talvez</button>
            <button type="button" className={status === "declined" ? "active" : ""} onClick={() => setStatus("declined")}>Não poderei</button>
          </div>
          <div className="twoMini">
            <input type="number" min="0" max={guest.maxCompanionsAdults || 20} value={adults} onChange={(e) => setAdults(e.target.value)} placeholder="Adultos confirmados" />
            <input type="number" min="0" max={guest.maxCompanionsChildren || 20} value={children} onChange={(e) => setChildren(e.target.value)} placeholder="Crianças" />
          </div>
          <textarea value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} placeholder="Alguma observação sobre alimentação, chegada ou acompanhantes?" />
          <button className="btn btnPrimary" type="button" onClick={saveConfirmation} disabled={saving}>{saving ? "Salvando..." : "Salvar resposta"}</button>
        </article>

        <article className="panel formGrid">
          <span className="kicker">Memória afetiva</span>
          <h2>Quer deixar uma lembrança para a Dani?</h2>
          <p>Conte uma história, situação engraçada ou mensagem carinhosa. A família poderá aprovar antes de publicar no mural.</p>
          <textarea value={memory} onChange={(e) => setMemory(e.target.value)} placeholder="Escreva sua lembrança aqui..." />
          <button className="btn btnSecondary" type="button" onClick={sendMemory} disabled={saving}>Enviar lembrança</button>
        </article>
      </section>

      {message ? <div className="notice success"><strong>{message}</strong></div> : null}
    </div>
  );
}
