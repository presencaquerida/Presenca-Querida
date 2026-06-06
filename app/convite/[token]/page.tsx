"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { EventBundle, Guest, GuestStatus } from "@/lib/types";
import { formatDateBR, formatTime } from "@/lib/status";

type GuestResponse = { bundle: EventBundle; guest: Guest; error?: string };

type FormState = {
  status: GuestStatus;
  companionsAdults: string;
  companionsChildren: string;
  dietaryNotes: string;
  notes: string;
  memory: string;
};

export default function ConvitePage({ params }: { params: { token: string } }) {
  const [bundle, setBundle] = useState<EventBundle | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [form, setForm] = useState<FormState>({ status: "confirmed", companionsAdults: "0", companionsChildren: "0", dietaryNotes: "", notes: "", memory: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/guests/${params.token}`, { cache: "no-store" });
        const data = (await response.json()) as GuestResponse;
        if (!response.ok) {
          setError(data.error || "Convite não encontrado.");
          return;
        }
        setBundle(data.bundle);
        setGuest(data.guest);
        setForm({
          status: data.guest.status === "declined" ? "declined" : data.guest.status === "maybe" ? "maybe" : "confirmed",
          companionsAdults: String(data.guest.companionsAdults || 0),
          companionsChildren: String(data.guest.companionsChildren || 0),
          dietaryNotes: data.guest.dietaryNotes || "",
          notes: data.guest.notes || "",
          memory: ""
        });
      } catch {
        setError("Não foi possível abrir o convite.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.token]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/guests/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: {
            status: form.status,
            companionsAdults: Number(form.companionsAdults || 0),
            companionsChildren: Number(form.companionsChildren || 0),
            dietaryNotes: form.dietaryNotes,
            notes: form.notes
          },
          memory: form.memory
        })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Não foi possível confirmar.");
        return;
      }
      setGuest(data.guest);
      setMessage("Obrigado! Sua resposta foi registrada com carinho.");
    } catch {
      setError("Erro ao salvar sua resposta.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="pageShell"><section className="panel">Carregando convite...</section></div>;
  if (error && !bundle) return <div className="pageShell"><section className="panel"><h1>Convite não encontrado</h1><p>{error}</p></section></div>;
  if (!bundle || !guest) return null;

  return (
    <div className="invitePage">
      <section className="inviteHero">
        <div className="invitePhotoWrap">
          <Image className="invitePhoto" src={bundle.event.honoreePhotoUrl || "/daniela-placeholder.svg"} alt={bundle.event.honoreeFullName} width={760} height={920} priority />
        </div>
        <div className="inviteCard">
          <span className="kicker">Convite especial</span>
          <h1>{bundle.event.title}</h1>
          <p className="lead">{bundle.event.headline}</p>
          <div className="guestNames">{guest.invitedNames.join(", ")}</div>
          <div className="eventFacts">
            <div><strong>Data</strong><span>{formatDateBR(bundle.event.eventDate)}</span></div>
            <div><strong>Horário</strong><span>{formatTime(bundle.event.startTime)} às {formatTime(bundle.event.endTime)}</span></div>
            <div><strong>Local</strong><span>{bundle.event.locationName}</span></div>
            <div><strong>Presença</strong><span>Responda abaixo com carinho.</span></div>
          </div>
          <form className="panel formGrid inviteFormArea" onSubmit={submit}>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GuestStatus })}>
              <option value="confirmed">Sim, vou participar</option>
              <option value="maybe">Talvez eu participe</option>
              <option value="declined">Não poderei ir</option>
            </select>
            <div className="twoMini">
              <input type="number" min="0" placeholder="Adultos" value={form.companionsAdults} onChange={(e) => setForm({ ...form, companionsAdults: e.target.value })} />
              <input type="number" min="0" placeholder="Crianças" value={form.companionsChildren} onChange={(e) => setForm({ ...form, companionsChildren: e.target.value })} />
            </div>
            <textarea placeholder="Alguma observação, restrição alimentar ou recado para a organização?" value={form.dietaryNotes} onChange={(e) => setForm({ ...form, dietaryNotes: e.target.value })} />
            <textarea placeholder="Quer deixar uma história, depoimento ou lembrança carinhosa?" value={form.memory} onChange={(e) => setForm({ ...form, memory: e.target.value })} />
            <button className="btn btnPrimary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Confirmar resposta"}</button>
            {message ? <div className="notice success"><strong>{message}</strong></div> : null}
            {error ? <div className="notice danger"><strong>{error}</strong></div> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
