import Link from "next/link";
import { getAcquisitionPlans } from "@/lib/data";

const whatsappNumber = "5519989848246";

function whatsappPlanUrl(plan: string) {
  const message = `Olá! Tenho interesse no Presença Querida, plano ${plan}. Quero entender qual formato combina melhor com meu evento.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const acquisitionModules = [
  ["Implantação", "Setup do evento, identidade visual, lista, links e testes antes do envio."],
  ["Uso recorrente", "Histórico de eventos e possibilidade de reutilizar estrutura em novas celebrações."],
  ["WhatsApp/CRM", "Textos prontos, links individuais, lembretes e custos externos combinados à parte."],
  ["Pós-evento", "Galeria, agradecimento, mural de recados e memória afetiva."],
  ["Operação assistida", "Acompanhamento dos pendentes, mensagens e relatório final."],
  ["Parceiros", "White label para cerimonialistas, buffets, assessorias e empresas." ]
];

export default async function HomePage() {
  const acquisitionOptions = await getAcquisitionPlans();

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
          Escolha um ponto de partida. A conversa no WhatsApp confirma escopo, quantidade de convidados, nível de apoio e necessidade de pós-evento antes do fechamento.
        </p>
        <div className="planGrid">
          {acquisitionOptions.map((item) => {
            const remaining = Math.max(item.founderSlotsTotal - item.founderSlotsUsed, 0);
            return (
              <article className="planCard" key={item.slug}>
                <span>{item.tag}</span>
                <h3>{item.name}</h3>
                <div className="priceStack">
                  <small>Valor de referência</small>
                  <strong className="oldPrice">{item.referencePrice}</strong>
                  <strong className="priceTag">{item.founderPrice}</strong>
                  <em>{remaining > 0 ? `${remaining} vaga(s) fundadoras disponíveis` : "Lista de espera para clientes fundadores"}</em>
                </div>
                <p>{item.description}</p>
                <ul>
                  {item.features.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <strong>{item.idealFor}</strong>
                <a className="btn btnPrimary planButton" href={whatsappPlanUrl(item.name)}>{item.ctaLabel}</a>
              </article>
            );
          })}
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
          <p>O primeiro passo é entender tipo de festa, quantidade de convidados, urgência, nível de ajuda e tom das mensagens. Para os primeiros clientes fundadores, a implantação pode sair sem custo em troca de depoimento e autorização de uso do case.</p>
        </div>
        <div className="actions">
          <a className="btn btnPrimary" href={whatsappPlanUrl("diagnóstico inicial")}>Solicitar diagnóstico</a>
          <Link className="btn btnSecondary" href="#opcoes-aquisicao">Ver planos</Link>
        </div>
      </section>
    </div>
  );
}
