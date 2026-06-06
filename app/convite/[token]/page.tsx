"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDateBR, formatTime, statusLabels } from "@/lib/status";
import type { EventBundle, Guest, GuestStatus } from "@/lib/types";

type InvitePayload = {
  bundle: EventBundle;
  guest: Guest;
};

export default function InvitePage({ params }: { params: { token: string } }) {
  const [payload, setPayload] = useState<InvitePayload | null>(null);
  const [status, setStatus] = useState<GuestStatus>("confirmed");
  const [companionsAdults, setCompanionsAdults] = useState(1);
  const [companionsChildren, setCompanionsChildren] = useState(0);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [memory, setMemory] = useState("");
  const [sent, setSent] = useState(false);
  const [memorySent, setMemorySent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setMessage("");
      try {
        const response = await fetch(`/api/guests/${params.token}`, { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setMessage(data?.error || "Convite não encontrado.");
          return;
        }
        const invite = data as InvitePayload;
        setPayload(invite);
        setStatus(invite.guest.status === "declined" || invite.guest.status === "maybe" ? invite.guest.status : "confirmed");
        setCompanionsAdults(invite.guest.companionsAdults || Math.max(1, invite.guest.invitedNames.length || 1));
        setCompanionsChildren(invite.guest.companionsChildren || 0);
        setDietaryNotes(invite.guest.dietaryNotes || "");
        setNotes(invite.guest.notes || "");
      } catch {
        setMessage("Não foi possível abrir o convite. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.token]);

  async function submitResponse(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/guests/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, companionsAdults, companionsChildren, dietaryNotes, notes })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(data?.error || "Não foi possível salvar sua resposta.");
        return;
      }
      setPayload((current) => current ? { ...current, guest: data.guest } : current);
      setSent(true);
    } catch {
      setMessage("Não foi possível salvar sua resposta. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function submitMemory() {
    if (!memory.trim()) {
      setMessage("Escreva uma mensagem antes de enviar.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/guests/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_memory", message: memory })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(data?.error || "Não foi possível enviar o depoimento.");
        return;
      }
      setMemory("");
      setMemorySent(true);
    } catch {
      setMessage("Não foi possível enviar o depoimento. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="pageShell"><section className="panel">Carregando convite...</section></div>;
  }

  if (!payload) {
    return (
      <div className="pageShell narrowShell">
        <section className="panel authPanel">
          <span className="kicker">Convite</span>
          <h1>Não encontramos este convite.</h1>
          <p>{message || "Confira o link recebido e tente novamente."}</p>
          <Link className="btn btnSecondary" href="/">Voltar</Link>
        </section>
      </div>
    );
  }

  const { bundle, guest } = payload;
  const event = bundle.event;
  const invitedNames = guest.invitedNames.length ? guest.invitedNames.join(", ") : guest.fullName;

  if (sent) {
    return (
      <div className="pageShell narrowShell">
        <section className="panel thankPanel">
          <span className="kicker">Obrigado</span>
          <h1>Sua resposta foi registrada.</h1>
          <p>{status === "confirmed" ? "Que alegria contar com sua presença." : status === "maybe" ? "Obrigado por avisar. Vamos acompanhar sua confirmação." : "Obrigado por responder com carinho."}</p>
          <p>Este convite está em nome de <strong>{invitedNames}</strong>.</p>
          <div className="notice success"><strong>Status atual: {statusLabels[status]}</strong></div>
          <div className="formGrid inviteFormArea">
            <label className="field">
              Quer deixar um recado, depoimento ou uma lembrança engraçada para a Dani?
              <textarea value={memory} onChange={(event) => setMemory(event.target.value)} placeholder="Escreva sua mensagem. Ela poderá aparecer no mural após aprovação da família." />
            </label>
            <button className="btn btnPrimary" type="button" disabled={saving} onClick={submitMemory}>{saving ? "Enviando..." : "Enviar recado"}</button>
            {memorySent ? <div className="notice success"><strong>Recado enviado. Obrigado pelo carinho!</strong></div> : null}
            {message ? <div className="notice danger"><strong>{message}</strong></div> : null}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="invitePage">
      <section className="inviteHero">
        <div className="invitePhotoWrap">
          <Image src={event.honoreePhotoUrl || "/daniela-placeholder.svg"} alt={event.honoreeFullName} width={720} height={720} className="invitePhoto" priority />
        </div>
        <div className="inviteCard">
          <span className="kicker">Convite especial</span>
          <h1>{event.title}</h1>
          <p className="lead">Oi, {guest.shortName || guest.fullName}. Este convite foi separado com carinho para você.</p>
          <div className="guestNames">{invitedNames}</div>
          <div className="eventFacts">
            <div><strong>Data</strong><span>{formatDateBR(event.eventDate)}</span></div>
            <div><strong>Horário</strong><span>{formatTime(event.startTime)} às {formatTime(event.endTime)}</span></div>
            <div><strong>Local</strong><span>{event.locationName}</span></div>
            <div><strong>Clima</strong><span>{event.theme}</span></div>
          </div>
          {event.isSurprise ? <div className="notice"><strong>Importante: é surpresa. Não comente com a Dani, combinado?</strong></div> : null}
          <form className="formGrid inviteFormArea" onSubmit={submitResponse}>
            <label className="field">
              Você poderá ir?
              <div className="segmented">
                <button type="button" className={status === "confirmed" ? "active" : ""} onClick={() => setStatus("confirmed")}>Sim</button>
                <button type="button" className={status === "maybe" ? "active" : ""} onClick={() => setStatus("maybe")}>Talvez</button>
                <button type="button" className={status === "declined" ? "active" : ""} onClick={() => setStatus("declined")}>Não poderei</button>
              </div>
            </label>
            {status !== "declined" ? (
              <div className="twoMini">
                <label className="field">Adultos<input type="number" min="0" value={companionsAdults} onChange={(event) => setCompanionsAdults(Number(event.target.value || 0))} /></label>
                <label className="field">Crianças<input type="number" min="0" value={companionsChildren} onChange={(event) => setCompanionsChildren(Number(event.target.value || 0))} /></label>
              </div>
            ) : null}
            <label className="field">Restrição alimentar ou observação<textarea value={dietaryNotes} onChange={(event) => setDietaryNotes(event.target.value)} placeholder="Ex.: vegetariano, alergia, observação importante" /></label>
            <label className="field">Mensagem para a família<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Opcional" /></label>
            <button className="btn btnPrimary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Confirmar resposta"}</button>
            {message ? <div className="notice danger"><strong>{message}</strong></div> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
