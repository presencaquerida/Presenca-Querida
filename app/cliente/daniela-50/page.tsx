import Image from "next/image";
import Link from "next/link";
import { menuImages } from "@/lib/demo-data";
import { getEventBundle } from "@/lib/data";
import { formatDateBR, formatTime } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function DanielaDemoPage() {
  const bundle = await getEventBundle("daniela-50");

  if (!bundle) {
    return <div className="container"><div className="panel">Evento não encontrado.</div></div>;
  }

  const { event } = bundle;

  return (
    <div className="container">
      <section className="hero">
        <div className="heroCard">
          <span className="eyebrow">Demo real · {event.honoreeFullName}</span>
          <h1>{event.title}</h1>
          <p className="lead">{event.headline}</p>
          <p>{event.description}</p>
          {event.isSurprise ? (
            <div className="notice danger"><strong>Modo festa surpresa:</strong> as mensagens reforçam para os convidados não comentarem com a Dani.</div>
          ) : null}
          <div className="actions">
            <Link className="btn btnPrimary" href="/convite/ana-silva-dani50">Abrir convite exemplo</Link>
            <Link className="btn btnSecondary" href="/gestao">Abrir painel de gestão</Link>
          </div>
        </div>

        <aside className="heroAside card">
          <div className="infoGrid">
            <div className="infoBox"><span>Data</span><strong>{formatDateBR(event.eventDate)}</strong></div>
            <div className="infoBox"><span>Horário</span><strong>{formatTime(event.startTime)} às {formatTime(event.endTime)}</strong></div>
            <div className="infoBox"><span>Local</span><strong><a href={event.locationUrl} target="_blank" rel="noreferrer">{event.locationName}</a></strong></div>
            <div className="infoBox"><span>Banda</span><strong><a href={event.bandUrl} target="_blank" rel="noreferrer">{event.bandName}</a></strong></div>
          </div>
          <div className="notice success"><strong>Buffet:</strong> <a href={event.buffetUrl} target="_blank" rel="noreferrer">{event.buffetName}</a>.</div>
          <p><strong>Tema:</strong> {event.theme}</p>
        </aside>
      </section>

      <section className="sectionTitle">
        <span className="kicker">Experiência do convidado</span>
        <h2>Uma página afetiva, simples e pronta para celular.</h2>
      </section>
      <div className="grid">
        <article className="card"><h3>1. Link individual</h3><p>O convidado recebe uma mensagem pelo WhatsApp com o link pessoal.</p></article>
        <article className="card"><h3>2. Confirmação clara</h3><p>Confirma presença, indica acompanhantes e deixa observações de forma rápida.</p></article>
        <article className="card"><h3>3. Controle da família</h3><p>A gestão acompanha pendentes, confirmados e mensagens por fase.</p></article>
      </div>

      <section className="sectionTitle">
        <span className="kicker">Referência do buffet</span>
        <h2>Fotos do cardápio J_M Festas anexadas ao projeto.</h2>
      </section>
      <div className="gallery">
        {menuImages.map((src, index) => (
          <a key={src} href={src} target="_blank" rel="noreferrer" aria-label={`Abrir foto ${index + 1} do cardápio`}>
            <Image src={src} alt={`Cardápio J_M Festas ${index + 1}`} width={540} height={720} className="galleryImage" />
          </a>
        ))}
      </div>

      <p className="footerNote">{event.privacyNote}</p>
    </div>
  );
}
