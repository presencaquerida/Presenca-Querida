import Link from "next/link";

const whatsappNumber = "5519989848246";

function whatsappPlanUrl(plan: string) {
  const message = `Olá! Tenho interesse no Presença Querida, plano ${plan}. Quero entender qual formato combina melhor com meu evento.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const acquisitionOptions = [
  {
    title: "Essencial",
    tag: "Cliente opera",
    price: "a partir de R$ 497",
    text: "Página do evento, confirmação de presença, lista de convidados, link individual e painel simples.",
    ideal: "Festas pequenas e familiares.",
    bullets: ["Convite digital com identidade", "Links individuais", "Painel de confirmados e pendentes"]
  },
  {
    title: "Organizado",
    tag: "Mais controle",
    price: "a partir de R$ 997",
    text: "Importação de convidados, grupos, mensagens por fase, controle de pendentes, exportação e histórico.",
    ideal: "Aniversários, bodas e eventos com muitas confirmações.",
    bullets: ["Importação por CSV", "Grupos de convidados", "Mensagens prontas por etapa"]
  },
  {
    title: "Memorável",
    tag: "Mais carinho",
    price: "a partir de R$ 1.497",
    text: "História da pessoa, foto da aniversariante, recados, depoimentos, agradecimento e galeria pós-evento.",
    ideal: "50, 60, 70 anos, bodas e festas surpresa.",
    bullets: ["Página afetiva da pessoa", "Mural de recados", "Memória pós-evento"]
  },
  {
    title: "Assistido",
    tag: "AE apoia operação",
    price: "sob diagnóstico",
    text: "A Automação Extrema ajuda na configuração, mensagens, acompanhamento dos pendentes e relatório final.",
    ideal: "Famílias que querem cuidado sem operar sistema.",
    bullets: ["Configuração assistida", "Apoio em mensagens", "Relatório final"]
  }
];

const acquisitionModules = [
  ["Implantação", "Setup do evento, identidade visual, lista, links e testes antes do envio."],
  ["Uso recorrente", "Histórico de eventos e possibilidade de reutilizar estrutura em novas celebrações."],
  ["WhatsApp/CRM", "Textos prontos, links individuais, lembretes e custos externos combinados à parte."],
  ["Pós-evento", "Galeria, agradecimento, mural de recados e memória afetiva."],
  ["Operação assistida", "Acompanhamento dos pendentes, mensagens e relatório final."],
  ["Parceiros", "White label para cerimonialistas, buffets, assessorias e empresas." ]
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
            O diferencial não é apenas perguntar quem vai. É conduzir cada convidado do primeiro aviso ao agradecimento final, com mensagem certa, no momento certo e com controle para quem organiza.
          </p>
          <div className="actions">
            <a className="btn btnPrimary" href="#opcoes-aquisicao">Ver opções de aquisição</a>
            <a className="btn btnSecondary" href={whatsappPlanUrl("diagnóstico")}>Falar no WhatsApp</a>
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
        <span className="kicker">Jeito comum x jeito Presença Querida</span>
        <h2>O problema não é enviar convite. É preservar carinho e previsibilidade.</h2>
        <div className="compareGrid">
          <div className="compareCard redSide">
            <h3>Jeito comum</h3>
            <ul>
              <li>Link genérico de confirmação de presença.</li>
              <li>Respostas espalhadas no WhatsApp.</li>
              <li>Convidado esquece de responder.</li>
              <li>Família fica desconfortável para cobrar.</li>
              <li>Buffet e lembrancinhas sem número confiável.</li>
            </ul>
          </div>
          <div className="compareCard blueSide">
            <h3>Jeito Presença Querida</h3>
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

      <section className="sectionBlock" id="opcoes-aquisicao">
        <span className="kicker">Opções de aquisição</span>
        <h2>Planos por nível de cuidado, não apenas por funcionalidade.</h2>
        <p className="sectionLead">
          Escolha o ponto de partida. A conversa no WhatsApp confirma escopo, quantidade de convidados, nível de apoio e necessidade de pós-evento antes do fechamento.
        </p>
        <div className="planGrid">
          {acquisitionOptions.map((item) => (
            <article className="planCard" key={item.title}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <strong className="priceTag">{item.price}</strong>
              <p>{item.text}</p>
              <ul>
                {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <strong>{item.ideal}</strong>
              <a className="btn btnPrimary planButton" href={whatsappPlanUrl(item.title)}>Quero este formato</a>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <span className="kicker">O que pode entrar no seu plano</span>
        <h2>Aquisição alinhada ao que entrega tranquilidade.</h2>
        <div className="modelGrid">
          {acquisitionModules.map(([title, text]) => (
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
          <h2>Descubra qual formato combina com seu evento.</h2>
          <p>Antes de baixar planilha ou entrar no sistema, o ideal é entender tipo de festa, quantidade de convidados, urgência, nível de ajuda e tom das mensagens.</p>
        </div>
        <div className="actions">
          <a className="btn btnPrimary" href={whatsappPlanUrl("diagnóstico inicial")}>Solicitar diagnóstico</a>
          <Link className="btn btnSecondary" href="#opcoes-aquisicao">Ver planos</Link>
        </div>
      </section>
    </div>
  );
}
