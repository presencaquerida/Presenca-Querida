export default function PrivacidadePage() {
  return (
    <div className="container">
      <section className="panel stack">
        <span className="kicker">Privacidade</span>
        <h1>Política simples de privacidade</h1>
        <p>
          O Presença Querida usa nome, telefone e respostas dos convidados somente para organizar o evento informado pela família ou responsável.
        </p>
        <div className="grid">
          <article className="card"><h3>Uso dos dados</h3><p>Confirmação de presença, acompanhantes, observações de buffet e mensagens de organização do evento.</p></article>
          <article className="card"><h3>Compartilhamento</h3><p>Os dados não são vendidos. O acesso deve ficar restrito aos responsáveis pela organização.</p></article>
          <article className="card"><h3>Remoção</h3><p>Após o evento, a base pode ser exportada e removida conforme combinado com o cliente.</p></article>
        </div>
      </section>
    </div>
  );
}
