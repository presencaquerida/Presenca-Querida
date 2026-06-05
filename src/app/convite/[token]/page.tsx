"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { EventInfo, Guest, GuestStatus } from "@/lib/types";
import { formatDateBR, formatTime, statusLabels } from "@/lib/status";

type GuestPayload = {
  event: EventInfo;
  guest: Guest;
};

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [payload, setPayload] = useState<GuestPayload | null>(null);
  const [status, setStatus] = useState<GuestStatus>("confirmed");
  const [companionsAdults, setCompanionsAdults] = useState(0);
  const [companionsChildren, setCompanionsChildren] = useState(0);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadGuest() {
      setLoading(true);
      const response = await fetch(`/api/guests/${token}`, { cache: "no-store" });
      if (!response.ok) {
        setPayload(null);
        setLoading(false);
        return;
      }
      const data = (await response.json()) as GuestPayload;
      setPayload(data);
      setStatus(data.guest.status === "pending" || data.guest.status === "save_date_sent" || data.guest.status === "invited" ? "confirmed" : data.guest.status);
      setCompanionsAdults(data.guest.companionsAdults ?? 0);
      setCompanionsChildren(data.guest.companionsChildren ?? 0);
      setDietaryNotes(data.guest.dietaryNotes ?? "");
      setNotes(data.guest.notes ?? "");
      setLoading(false);
    }
    loadGuest();
  }, [token]);

  const totalPeople = useMemo(() => {
    if (status !== "confirmed") return 0;
    return 1 + Number(companionsAdults || 0) + Number(companionsChildren || 0);
  }, [status, companionsAdults, companionsChildren]);

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/guests/${token}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, companionsAdults, companionsChildren, dietaryNotes, notes })
    });
    if (!response.ok) {
      setMessage("Não foi possível salvar agora. Tente novamente em alguns instantes.");
      setSaving(false);
      return;
    }
    const data = (await response.json()) as { guest: Guest };
    setPayload((current) => (current ? { ...current, guest: data.guest } : current));
    setMessage("Resposta salva com carinho. Muito obrigado!");
    setSaving(false);
  }

  if (loading) {
    return <div className="container"><div className="panel">Carregando convite...</div></div>;
  }

  if (!payload) {
    return <div className="container"><div className="panel">Convite não encontrado. Confira se o link está completo.</div></div>;
  }

  const { event, guest } = payload;

  return (
    <div className="container">
      <section className="hero">
        <div className="heroCard">
          <span className="eyebrow">Convite separado para {guest.shortName}</span>
          <h1>{event.title}</h1>
          <p className="lead">{event.headline}</p>
          <p>
            Será em {formatDateBR(event.eventDate)}, das {formatTime(event.startTime)} às {formatTime(event.endTime)}, na {event.locationName}.
          </p>
          <div className="infoGrid">
            <div className="infoBox"><span>Banda</span><strong>{event.bandName}</strong></div>
            <div className="infoBox"><span>Show</span><strong>{formatTime(event.bandStartTime)} às {formatTime(event.bandEndTime)}</strong></div>
          </div>
          {event.isSurprise ? <div className="notice danger"><strong>Segredo:</strong> é uma festa surpresa. Por favor, não comente com a Dani. 🤫</div> : null}
        </div>

        <aside className="panel stack">
          <div>
            <span className="kicker">Confirmação de presença</span>
            <h2>Você vem?</h2>
            <p>Essa resposta ajuda a família a organizar buffet, mesas e lembrancinhas sem ficar cobrando pelo WhatsApp.</p>
          </div>

          <div className="segmented" role="group" aria-label="Status da presença">
            <button className={status === "confirmed" ? "active" : ""} onClick={() => setStatus("confirmed")}>Sim, vou</button>
            <button className={status === "maybe" ? "active" : ""} onClick={() => setStatus("maybe")}>Talvez</button>
            <button className={status === "declined" ? "active" : ""} onClick={() => setStatus("declined")}>Não poderei</button>
          </div>

          {status === "confirmed" ? (
            <div className="formGrid">
              <div className="field">
                <label htmlFor="adults">Acompanhantes adultos</label>
                <input id="adults" type="number" min="0" value={companionsAdults} onChange={(e) => setCompanionsAdults(Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="children">Crianças</label>
                <input id="children" type="number" min="0" value={companionsChildren} onChange={(e) => setCompanionsChildren(Number(e.target.value))} />
              </div>
              <div className="notice success"><strong>Total previsto:</strong> {totalPeople} pessoa(s).</div>
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="diet">Observação para buffet</label>
            <input id="diet" placeholder="Ex.: criança, restrição alimentar, observação importante" value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="notes">Recado para a família</label>
            <textarea id="notes" placeholder="Opcional" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <button className="btn btnPrimary" onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar resposta"}</button>
          {message ? <div className="notice success">{message}</div> : null}
          <p>Status atual: <strong>{statusLabels[guest.status]}</strong></p>
        </aside>
      </section>
    </div>
  );
}
