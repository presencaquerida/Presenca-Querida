import Link from "next/link";

const acquisitionOptions = [
  {
    title: "Essencial",
    tag: "Cliente opera",
    text: "Página do evento, RSVP, lista de convidados, link individual e painel simples.",
    ideal: "Festas pequenas e familiares."
  },
  {
    title: "Organizado",
    tag: "Com acompanhamento",
    text: "Importação de convidados, grupos, mensagens por fase, pendentes e exportação.",
    ideal: "Aniversários, bodas e eventos com muitas confirmações."
  },
  {
    title: "Memorável",
    tag: "Oceano Azul",
    text: "História da pessoa, foto da aniversariante, recados, depoimentos e galeria pós-evento.",
    ideal: "50, 60, 70 anos, bodas e festas surpresa."
  },
  {
    title: "Assistido",
    tag: "AE apoia operação",
    text: "A Automação Extrema ajuda na configuração, mensagens, acompanhamento e relatório final.",
    ideal: "Famílias que querem cuidado sem operar sistema."
  }
];

const monetization = [
  ["Implantação", "Setup do evento, identidade, lista, links e testes."],
  ["Mensalidade", "Uso recorrente, histórico de eventos e novos convites."],
  ["Operação assistida", "AE acompanha pendentes, mensagens e relatório final."],
  ["WhatsApp/CRM", "Sequências, templates, BotConversa/API e custos externos repassados."],
  ["Pós-evento", "Galeria, agradecimento, mural de recados e memória afetiva."],
  ["White label", "Marca de cerimonialista, buffet, assessoria ou empresa parceira."]
];

export default function HomePage() {
  return (
    <div className="pageShell">
      <section className="hero impactHero">
        <div className="heroCopy">
          <span className="eyebrow">Gestão afetiva de presença</span>
          <h1>Convide, lembre e confirme sem parecer cobrança.</h1>
          <p className="lead">
            Presença Querida ajuda famílias e pequenos organizadores a transformar a confirmação de presença em uma jornada carinhosa, simples e controlada.
          </p>
          <p>
            O diferencial não é apenas ter RSVP. É conduzir o convidado do save the date ao agradecimento final, com mensagem certa, no momento certo e com controle para quem organiza.
          </p>
          <div className="actions">
            <Link className="btn btnPrimary" href="/cliente/daniela-50">Área cliente</Link>
            <Link className="btn btnSecondary" href="/gestao">Área gestão</Link>
          </div>
        </div>

        <aside className="impactCard">
          <h2>O que torna o Presença Querida diferente?</h2>
          <p>
            Em vez de ser só mais um convite digital, ele organiza presença, contexto, lembrança, acompanhantes, mensagens e memória afetiva.
          </p>
          <div className="miniGrid">
            <div><strong>Mobile-first</strong><span>Confirmação rápida pelo celular.</span></div>
            <div><strong>Dinâmico</strong><span>Cada convidado recebe seu link.</span></div>
            <div><strong>Afetivo</strong><span>Convite com foto, história e cuidado.</span></div>
            <div><strong>Gestão</strong><span>Pendentes, confirmados e relatórios.</span></div>
          </div>
        </aside>
      </section>

      <section className="sectionBlock">
        <span className="kicker">Mar Vermelho x Oceano Azul</span>
        <h2>O problema não é enviar convite. É preservar carinho e previsibilidade.</h2>
        <div className="compareGrid">
          <div className="compareCard redSide">
            <h3>Mar Vermelho</h3>
            <ul>
              <li>Link genérico de RSVP.</li>
              <li>Confirmações espalhadas no WhatsApp.</li>
              <li>Convidado esquece de responder.</li>
              <li>Família fica desconfortável para cobrar.</li>
              <li>Buffet e lembrancinhas sem número confiável.</li>
            </ul>
          </div>
          <div className="compareCard blueSide">
            <h3>Oceano Azul</h3>
            <ul>
              <li>Jornada individual do convidado.</li>
              <li>Mensagem personalizada por fase.</li>
              <li>Link dinâmico com dados já preenchidos.</li>
              <li>Recados e memórias para a aniversariante.</li>
              <li>Painel de presença para decisões seguras.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <span className="kicker">Opções de aquisição</span>
        <h2>Planos por nível de cuidado, não apenas por funcionalidade.</h2>
        <div className="planGrid">
          {acquisitionOptions.map((item) => (
            <article className="planCard" key={item.title}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.ideal}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <span className="kicker">Modelos combináveis</span>
        <h2>Monetização alinhada ao que entrega tranquilidade.</h2>
        <div className="modelGrid">
          {monetization.map(([title, text]) => (
            <article className="modelCard" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock finalCta">
        <div>
          <span className="kicker">Próximo passo</span>
          <h2>Comece pela lista de convidados.</h2>
          <p>Baixe o modelo, preencha nomes, telefones, grupos e convidados do mesmo invite. Depois importe pela área Cliente ou Gestão.</p>
        </div>
        <div className="actions">
          <a className="btn btnPrimary" href="/modelos/convidados-modelo.csv" download>Baixar modelo CSV</a>
          <Link className="btn btnSecondary" href="/login">Entrar no sistema</Link>
        </div>
      </section>
    </div>
  );
}
