"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { EventBundle, Guest, GuestStatus } from "@/lib/types";
import { formatDateBR, formatTime, statusLabels } from "@/lib/status";

type InviteData = {
  bundle: EventBundle;
  guest: Guest;
};

type PageProps = {
  params: { token: string };
};

export default function InvitePage({ params }: PageProps) {
  const [data, setData] = useState<InviteData | null>(null);
  const [status, setStatus] = useState<GuestStatus>("confirmed");
  const [companionsAdults, setCompanionsAdults] = useState("1");
  const [companionsChildren, setCompanionsChildren] = useState("0");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [memoryMessage, setMemoryMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/guests/${params.token}`, { cache: "no-store" });
      if (!response.ok) {
        setError("Não encontramos este convite. Confira se o link foi copiado por completo.");
        setLoading(false);
        return;
      }
      const payload = (await response.json()) as InviteData;
      setData(payload);
      setStatus(payload.guest.status === "declined" || payload.guest.status === "maybe" ? payload.guest.status : "confirmed");
      setCompanionsAdults(String(Math.max(payload.guest.companionsAdults || payload.guest.invitedNames.length || 1, 1)));
      setCompanionsChildren(String(payload.guest.companionsChildren || 0));
      setDietaryNotes(payload.guest.dietaryNotes || "");
      setNotes(payload.guest.notes || "");
      setLoading(false);
    }
    load();
  }, [params.token]);

  const event = data?.bundle.event;
  const guest = data?.guest;
  const inviteNames = useMemo(() => {
    if (!guest) return "";
    return guest.invitedNames?.length ? guest.invitedNames.join(", ") : guest.fullName;
  }, [guest]);

  async function submitAnswer(eventSubmit: React.FormEvent) {
    eventSubmit.preventDefault();
    setSaving(true);
    setError("");
    const response = await fetch(`/api/guests/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        companionsAdults: Number(companionsAdults || 0),
        companionsChildren: Number(companionsChildren || 0),
        dietaryNotes,
        notes,
        memoryMessage
      })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      setError(payload?.error || "Não foi possível salvar sua resposta. Tente novamente.");
      setSaving(false);
      return;
    }
    setSent(true);
    setSaving(false);
  }

  if (loading) {
    return <div className="pageShell"><section className="panel">Carregando convite...</section></div>;
  }

  if (error && !data) {
    return <div className="pageShell"><section className="panel"><h1>Convite não encontrado</h1><p>{error}</p></section></div>;
  }

  if (!event || !guest) return null;

  if (sent) {
    return (
      <div className="pageShell thankPanel">
        <section className="panel">
          <span className="kicker">Resposta recebida</span>
          <h1>Obrigado, {guest.shortName || guest.fullName}!</h1>
          <p className="lead">
            Sua resposta ficou registrada como: <strong>{statusLabels[status]}</strong>.
          </p>
          {memoryMessage.trim() ? (
            <p>Seu recado foi enviado para aprovação da família antes de aparecer no mural.</p>
          ) : (
            <p>Você ainda pode voltar pelo mesmo link se quiser deixar uma lembrança ou história carinhosa para a Dani.</p>
          )}
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
          <span className="eyebrow">Convite separado com carinho</span>
          <h1>{event.title}</h1>
          <p className="lead">{event.headline}</p>
          <div className="guestNames">{inviteNames}</div>
          <div className="eventFacts">
            <div><strong>Data</strong><span>{formatDateBR(event.eventDate)}</span></div>
            <div><strong>Horário</strong><span>{formatTime(event.startTime)} às {formatTime(event.endTime)}</span></div>
            <div><strong>Local</strong><span>{event.locationName}</span></div>
            <div><strong>Música</strong><span>{event.bandName} · {formatTime(event.bandStartTime)} às {formatTime(event.bandEndTime)}</span></div>
          </div>

          {event.isSurprise ? <div className="notice"><strong>É surpresa:</strong> não comente com a Dani, combinado?</div> : null}

          <form className="formGrid inviteFormArea" onSubmit={submitAnswer}>
            <span className="kicker">Sua resposta</span>
            <div className="segmented">
              <button type="button" className={status === "confirmed" ? "active" : ""} onClick={() => setStatus("confirmed")}>Vou sim</button>
              <button type="button" className={status === "maybe" ? "active" : ""} onClick={() => setStatus("maybe")}>Talvez</button>
              <button type="button" className={status === "declined" ? "active" : ""} onClick={() => setStatus("declined")}>Não poderei</button>
            </div>

            {status === "confirmed" ? (
              <div className="twoMini">
                <label className="field">Adultos confirmados
                  <input type="number" min="0" value={companionsAdults} onChange={(event) => setCompanionsAdults(event.target.value)} />
                </label>
                <label className="field">Crianças confirmadas
                  <input type="number" min="0" value={companionsChildren} onChange={(event) => setCompanionsChildren(event.target.value)} />
                </label>
              </div>
            ) : null}

            <label className="field">Observações para a organização
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: restrição alimentar, chegada mais tarde, dúvida ou recado para a organização." />
            </label>

            <label className="field">Alguma restrição alimentar?
              <textarea value={dietaryNotes} onChange={(event) => setDietaryNotes(event.target.value)} placeholder="Opcional." />
            </label>

            <label className="field">Quer deixar uma lembrança ou história engraçada com a Dani?
              <textarea value={memoryMessage} onChange={(event) => setMemoryMessage(event.target.value)} placeholder="Opcional. A família aprova antes de publicar no mural." />
            </label>

            {error ? <div className="notice danger"><strong>{error}</strong></div> : null}
            <button className="btn btnPrimary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Enviar resposta"}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
