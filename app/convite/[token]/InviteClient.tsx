"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { EventBundle, Guest, GuestStatus } from "@/lib/types";
import { formatDateBR, formatTime, statusLabels } from "@/lib/status";

type Props = { bundle: EventBundle; guest: Guest };

type GuestResponse = {
  status: GuestStatus;
  companionsAdults: number;
  companionsChildren: number;
  dietaryNotes: string;
  notes: string;
};

export function InviteClient({ bundle, guest: initialGuest }: Props) {
  const [guest, setGuest] = useState(initialGuest);
  const [form, setForm] = useState<GuestResponse>({
    status: initialGuest.status === "confirmed" || initialGuest.status === "maybe" || initialGuest.status === "declined" ? initialGuest.status : "confirmed",
    companionsAdults: initialGuest.companionsAdults,
    companionsChildren: initialGuest.companionsChildren,
    dietaryNotes: initialGuest.dietaryNotes,
    notes: initialGuest.notes
  });
  const [memory, setMemory] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(initialGuest.status === "confirmed");

  const event = bundle.event;
  const invitedNames = useMemo(() => guest.invitedNames?.length ? guest.invitedNames.join(", ") : guest.fullName, [guest]);

  async function submitResponse(eventSubmit: React.FormEvent) {
    eventSubmit.preventDefault();
    setMessage("");
    const response = await fetch(`/api/guests/${guest.token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!response.ok) {
      setMessage("Não foi possível registrar sua resposta. Tente novamente.");
      return;
    }
    const updated = (await response.json()) as Guest;
    setGuest(updated);
    setSubmitted(true);
    setMessage("Resposta registrada com carinho. Obrigado!");
  }

  async function submitMemory(eventSubmit: React.FormEvent) {
    eventSubmit.preventDefault();
    if (memory.trim().length < 8) {
      setMessage("Escreva um depoimento um pouco maior para enviar.");
      return;
    }
    const response = await fetch(`/api/guests/${guest.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memory })
    });
    if (!response.ok) {
      setMessage("Não foi possível enviar o depoimento agora.");
      return;
    }
    setMemory("");
    setMessage("Depoimento recebido. A família poderá aprovar antes de aparecer no mural.");
  }

  return (
    <div className="invitePage">
      <section className="inviteHero">
        <div className="invitePhotoWrap">
          <Image src={event.honoreePhotoUrl || "/daniela-placeholder.svg"} alt={event.honoreeFullName} width={640} height={720} className="invitePhoto" priority />
        </div>
        <div className="inviteCard">
          <span className="eyebrow">Convite separado com carinho</span>
          <h1>{event.title}</h1>
          <p className="lead">Oi, {guest.shortName || guest.fullName}. Este convite é para:</p>
          <div className="guestNames">{invitedNames}</div>
          <p>{event.headline}</p>
          <div className="eventFacts">
            <div><strong>Data</strong><span>{formatDateBR(event.eventDate)}</span></div>
            <div><strong>Horário</strong><span>{formatTime(event.startTime)} às {formatTime(event.endTime)}</span></div>
            <div><strong>Local</strong><span>{event.locationName}</span></div>
            <div><strong>Música</strong><span>{event.bandName}</span></div>
          </div>
          {event.isSurprise ? <div className="notice danger"><strong>É surpresa:</strong> não comente com a Dani. 💚</div> : null}
        </div>
      </section>

      <section className="pageShell inviteFormArea">
        {message ? <div className="notice success"><strong>{message}</strong></div> : null}

        {!submitted ? (
          <form className="panel formGrid" onSubmit={submitResponse}>
            <span className="kicker">Confirmação</span>
            <h2>Você poderá estar presente?</h2>
            <div className="segmented">
              <button type="button" className={form.status === "confirmed" ? "active" : ""} onClick={() => setForm({ ...form, status: "confirmed" })}>Sim, vou</button>
              <button type="button" className={form.status === "maybe" ? "active" : ""} onClick={() => setForm({ ...form, status: "maybe" })}>Talvez</button>
              <button type="button" className={form.status === "declined" ? "active" : ""} onClick={() => setForm({ ...form, status: "declined" })}>Não poderei</button>
            </div>

            <div className="twoMini">
              <label className="field">Adultos no convite
                <input type="number" min="0" value={form.companionsAdults} onChange={(e) => setForm({ ...form, companionsAdults: Number(e.target.value) })} />
              </label>
              <label className="field">Crianças no convite
                <input type="number" min="0" value={form.companionsChildren} onChange={(e) => setForm({ ...form, companionsChildren: Number(e.target.value) })} />
              </label>
            </div>
            <small>Quando o invite já inclui a família, informe o total de pessoas que irão neste convite.</small>
            <textarea placeholder="Alguma restrição alimentar, observação ou recado para a organização?" value={form.dietaryNotes} onChange={(e) => setForm({ ...form, dietaryNotes: e.target.value })} />
            <button className="btn btnPrimary" type="submit">Enviar confirmação</button>
          </form>
        ) : (
          <div className="panel formGrid thankPanel">
            <span className="kicker">Obrigado</span>
            <h2>Sua resposta ficou registrada: {statusLabels[guest.status]}.</h2>
            <p>Agora, que tal deixar uma lembrança, depoimento ou situação engraçada com a Dani? A família poderá aprovar e mostrar no mural da festa.</p>
            <form className="formGrid" onSubmit={submitMemory}>
              <textarea placeholder="Escreva uma lembrança carinhosa, uma história engraçada ou uma mensagem para a Dani..." value={memory} onChange={(e) => setMemory(e.target.value)} />
              <button className="btn btnPrimary" type="submit">Enviar depoimento</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
