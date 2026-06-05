import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroCard">
          <span className="eyebrow">Gestão afetiva de presença</span>
          <h1>Convide, lembre e confirme sem parecer cobrança.</h1>
          <p className="lead">
            Presença Querida ajuda famílias e pequenos organizadores a transformar RSVP em uma jornada carinhosa: save the date, convite, lembretes, orientações finais e painel de controle.
          </p>
          <div className="actions">
            <Link className="btn btnPrimary" href="/cliente/daniela-50">Ver demo Daniela 50</Link>
            <Link className="btn btnSecondary" href="/gestao">Abrir gestão</Link>
          </div>
        </div>
        <aside className="heroAside card">
          <div className="eventBadge">
            <small>Primeira cliente demo</small>
            <h2>Dani 50</h2>
            <p>Uma festa tropical, afetiva e organizada para celebrar Daniela Mattano da Silva.</p>
          </div>
          <div className="infoGrid">
            <div className="infoBox"><span>Oceano azul</span><strong>Presença com carinho</strong></div>
            <div className="infoBox"><span>Dor resolvida</span><strong>WhatsApp sem bagunça</strong></div>
            <div className="infoBox"><span>Foco</span><strong>Mobile-first</strong></div>
            <div className="infoBox"><span>Valor</span><strong>Controle + afeto</strong></div>
          </div>
        </aside>
      </section>

      <section className="sectionTitle">
        <span className="kicker">Por que não é só convite?</span>
        <h2>O diferencial está na jornada do convidado.</h2>
      </section>
      <div className="grid">
        <article className="card"><h3>Save the date</h3><p>A pessoa reserva a data sem pressão e o organizador sabe quem já foi avisado.</p></article>
        <article className="card"><h3>Link individual</h3><p>Cada convidado se sente lembrado, confirma pelo celular e mantém o link salvo.</p></article>
        <article className="card"><h3>Painel de presença</h3><p>Confirmados, pendentes, talvez, acompanhantes e observações em uma visão simples.</p></article>
      </div>
    </div>
  );
}
