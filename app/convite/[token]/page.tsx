"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatDateBR, formatTime } from "@/lib/status";
import type { EventBundle, Guest, GuestStatus } from "@/lib/types";

type InvitePayload = {
  bundle: EventBundle;
  guest: Guest;
};

export default function DynamicInvitePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;
  const [payload, setPayload] = useState<InvitePayload | null>(null);
  const [status, setStatus] = useState<GuestStatus>("confirmed");
  const [companionsAdults, setCompanionsAdults] = useState("0");
  const [companionsChildren, setCompanionsChildren] = useState("0");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [memoryMessage, setMemoryMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function loadInvite() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/guests/${token}`, { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Não foi possível abrir este convite.");
        setPayload(null);
        return;
      }
      const inviteData = data as InvitePayload;
      setPayload(inviteData);
      setStatus(inviteData.guest.status === "declined" || inviteData.guest.status === "maybe" ? inviteData.guest.status : "confirmed");
      setCompanionsAdults(String(inviteData.guest.companionsAdults || Math.min(inviteData.guest.invitedNames.length || 1, 1)));
      setCompanionsChildren(String(inviteData.guest.companionsChildren || 0));
      setDietaryNotes(inviteData.guest.dietaryNotes || "");
      setNotes(inviteData.guest.notes || "");
    } catch {
      setError("Não foi possível carregar o convite. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const invitedList = useMemo(() => payload?.guest.invitedNames?.length ? payload.guest.invitedNames : [payload?.guest.fullName || ""], [payload]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/guests/${token}`, {
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
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Não foi possível salvar sua resposta.");
        return;
      }
      setSaved(true);
      await loadInvite();
    } catch {
      setError("Não foi possível salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="pageShell narrowShell"><section className="panel">Carregando convite...</section></main>;
  }

  if (error && !payload) {
    return (
      <main className="pageShell narrowShell">
        <section className="panel authPanel">
          <span className="kicker">Convite</span>
          <h1>Não conseguimos abrir este convite.</h1>
          <p>{error}</p>
          <Link className="btn btnSecondary" href="/">Voltar</Link>
        </section>
      </main>
    );
  }

  if (!payload) return null;

  const { event, memories } = payload.bundle;
  const { guest } = payload;

  if (saved) {
    return (
      <main className="pageShell narrowShell">
        <section className="panel thankPanel">
          <span className="kicker">Obrigado</span>
          <h1>Resposta registrada com carinho.</h1>
          <p>
            Obrigado, {guest.shortName || guest.fullName}. Sua resposta ajuda a família a organizar buffet,
            mesas, lembrancinhas e todos os detalhes com mais tranquilidade.
          </p>
          {memoryMessage.trim() ? <p>Seu depoimento foi enviado para aprovação antes de aparecer no mural.</p> : null}
          <div className="actions">
            <button className="btn btnPrimary" type="button" onClick={() => setSaved(false)}>Editar resposta</button>
            <Link className="btn btnSecondary" href="/">Conhecer o Presença Querida</Link>
          </div>
        </section>

        {memories.filter((item) => item.isApproved).length ? (
          <section className="sectionBlock">
            <span className="kicker">Mural de carinho</span>
            <h2>Recados já aprovados</h2>
            <div className="grid">
              {memories.filter((item) => item.isApproved).slice(0, 6).map((item) => (
                <article className="card" key={item.id}>
                  <h3>{item.guestName}</h3>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    );
  }

  return (
    <main className="invitePage">
      <section className="inviteHero">
        <div className="invitePhotoWrap">
          <Image src={event.honoreePhotoUrl || "/daniela-placeholder.svg"} alt={event.honoreeFullName} className="invitePhoto" width={900} height={900} priority />
        </div>
        <div className="inviteCard">
          <span className="eyebrow">Convite separado com carinho</span>
          <h1>{event.title}</h1>
          <p className="lead">{event.headline}</p>
          <div className="guestNames">{invitedList.join(", ")}</div>
          <div className="eventFacts">
            <div><strong>Data</strong><span>{formatDateBR(event.eventDate)}</span></div>
            <div><strong>Horário</strong><span>{formatTime(event.startTime)} às {formatTime(event.endTime)}</span></div>
            <div><strong>Local</strong><span>{event.locationName}</span></div>
            <div><strong>Música</strong><span>{event.bandName || "Em definição"}</span></div>
          </div>
          {event.isSurprise ? <div className="notice"><strong>Importante:</strong> é surpresa. Não comente com a Dani, combinado?</div> : null}
        </div>
      </section>

      <section className="pageShell inviteFormArea">
        <form className="panel formGrid" onSubmit={submit}>
          <span className="kicker">Confirmação de presença</span>
          <h2>Você poderá participar?</h2>
          <div className="segmented">
            <button type="button" className={status === "confirmed" ? "active" : ""} onClick={() => setStatus("confirmed")}>Sim, vou</button>
            <button type="button" className={status === "maybe" ? "active" : ""} onClick={() => setStatus("maybe")}>Talvez</button>
            <button type="button" className={status === "declined" ? "active" : ""} onClick={() => setStatus("declined")}>Não poderei ir</button>
          </div>
          <div className="twoMini">
            <label className="field">Adultos confirmados
              <input type="number" min="0" max={Math.max(guest.maxCompanionsAdults + invitedList.length, invitedList.length)} value={companionsAdults} onChange={(e) => setCompanionsAdults(e.target.value)} />
            </label>
            <label className="field">Crianças
              <input type="number" min="0" max={Math.max(guest.maxCompanionsChildren, 0)} value={companionsChildren} onChange={(e) => setCompanionsChildren(e.target.value)} />
            </label>
          </div>
          <label className="field">Alguma restrição alimentar ou observação?
            <textarea value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} placeholder="Ex.: vegetariano, alergia, criança pequena..." />
          </label>
          <label className="field">Quer deixar alguma observação para a organização?
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mensagem privada para quem organiza." />
          </label>
          <label className="field">Quer deixar um depoimento, lembrança ou história engraçada com a Dani?
            <textarea value={memoryMessage} onChange={(e) => setMemoryMessage(e.target.value)} placeholder="Se quiser, escreva aqui. A família aprova antes de aparecer no mural." />
          </label>
          {error ? <div className="notice danger"><strong>{error}</strong></div> : null}
          <button className="btn btnPrimary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Enviar confirmação"}</button>
        </form>
      </section>
    </main>
  );
}
