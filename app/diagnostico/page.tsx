
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const whatsappNumber = "5519989848246";

const initialForm = {
  name: "",
  whatsapp: "",
  email: "",
  eventType: "",
  eventDate: "",
  guestCount: "",
  hasGuestList: "",
  interestPlan: "",
  needsHelp: "",
  messageTone: "",
  urgency: "",
  notes: ""
};

export default function DiagnosticoPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const whatsappHref = useMemo(() => {
    const message = [
      "Olá! Preenchi o diagnóstico do Presença Querida.",
      form.name ? `Nome: ${form.name}` : "",
      form.eventType ? `Evento: ${form.eventType}` : "",
      form.guestCount ? `Convidados: ${form.guestCount}` : "",
      form.interestPlan ? `Plano de interesse: ${form.interestPlan}` : "",
      "Gostaria de entender o melhor formato para meu evento."
    ].filter(Boolean).join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [form.eventType, form.guestCount, form.interestPlan, form.name]);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/leads/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "diagnostico_presenca_querida" })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Não foi possível enviar o diagnóstico.");
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao enviar diagnóstico.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageShell narrowShell">
      <section className="panel authPanel">
        <span className="kicker">Diagnóstico Presença Querida</span>
        <h1>Descubra o formato ideal para seu evento.</h1>
        <p className="lead">
          Responda poucas perguntas para a Automação Extrema entender se seu evento precisa só de confirmação, acompanhamento de pendentes, história da pessoa ou operação assistida.
        </p>
        <form className="formGrid" onSubmit={submit}>
          <div className="twoMini">
            <input placeholder="Seu nome" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <input placeholder="WhatsApp com DDD" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} required />
          </div>
          <input type="email" placeholder="E-mail, opcional" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <div className="twoMini">
            <select value={form.eventType} onChange={(e) => update("eventType", e.target.value)} required>
              <option value="">Tipo de evento</option>
              <option>Aniversário de 50/60/70 anos</option>
              <option>Bodas</option>
              <option>Festa surpresa</option>
              <option>Chá, batizado ou comunhão</option>
              <option>Confraternização familiar</option>
              <option>Outro evento afetivo</option>
            </select>
            <input type="date" value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} />
          </div>
          <div className="twoMini">
            <select value={form.guestCount} onChange={(e) => update("guestCount", e.target.value)} required>
              <option value="">Quantidade de convidados</option>
              <option>Até 30 pessoas</option>
              <option>31 a 80 pessoas</option>
              <option>81 a 150 pessoas</option>
              <option>Mais de 150 pessoas</option>
            </select>
            <select value={form.hasGuestList} onChange={(e) => update("hasGuestList", e.target.value)} required>
              <option value="">Já tem lista?</option>
              <option>Sim, em planilha</option>
              <option>Sim, mas está no WhatsApp</option>
              <option>Ainda não</option>
              <option>Preciso de ajuda para organizar</option>
            </select>
          </div>
          <div className="twoMini">
            <select value={form.interestPlan} onChange={(e) => update("interestPlan", e.target.value)} required>
              <option value="">O que mais combina?</option>
              <option>Essencial - página e confirmação</option>
              <option>Organizado - lista, grupos e mensagens</option>
              <option>Memorável - história, foto e depoimentos</option>
              <option>Assistido - quero ajuda na operação</option>
              <option>Não sei ainda</option>
            </select>
            <select value={form.needsHelp} onChange={(e) => update("needsHelp", e.target.value)} required>
              <option value="">Nível de ajuda desejado</option>
              <option>Quero operar sozinho</option>
              <option>Quero ajuda na configuração</option>
              <option>Quero ajuda com mensagens e pendentes</option>
              <option>Quero que a AE acompanhe tudo comigo</option>
            </select>
          </div>
          <div className="twoMini">
            <select value={form.messageTone} onChange={(e) => update("messageTone", e.target.value)} required>
              <option value="">Tom das mensagens</option>
              <option>Carinhoso e familiar</option>
              <option>Elegante e discreto</option>
              <option>Animado e descontraído</option>
              <option>Surpresa, com cuidado para não vazar</option>
            </select>
            <select value={form.urgency} onChange={(e) => update("urgency", e.target.value)} required>
              <option value="">Urgência</option>
              <option>Evento ainda longe</option>
              <option>Preciso começar este mês</option>
              <option>Preciso começar esta semana</option>
              <option>Urgente, já estou com pendências</option>
            </select>
          </div>
          <textarea placeholder="Conte rapidamente sua principal preocupação com os convidados" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          <button className="btn btnPrimary" type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar diagnóstico"}</button>
        </form>

        {error ? <div className="notice danger"><strong>{error}</strong></div> : null}
        {success ? (
          <div className="notice success">
            <strong>Diagnóstico enviado para a Gestão.</strong>
            <p>Agora você pode chamar no WhatsApp com o contexto já organizado.</p>
            <a className="btn btnPrimary" href={whatsappHref} target="_blank" rel="noreferrer">Fale no WhatsApp</a>
          </div>
        ) : null}
        <Link href="/">Voltar para a página principal</Link>
      </section>
    </div>
  );
}
