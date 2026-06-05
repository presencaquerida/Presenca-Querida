export default function PrivacidadePage() {
  return (
    <div className="pageShell narrowShell">
      <section className="panel">
        <span className="kicker">Privacidade</span>
        <h1>Dados usados apenas para organizar o evento.</h1>
        <p>
          O Presença Querida usa nome, telefone, grupo e resposta de presença somente para organização da celebração, envio de orientações e prestação de controle ao cliente responsável.
        </p>
        <p>
          Os depoimentos enviados pelos convidados passam por aprovação antes de aparecerem no mural público da festa.
        </p>
        <p>
          A família pode solicitar remoção dos dados após o evento. As chaves do Supabase devem ficar protegidas nas variáveis de ambiente do Vercel.
        </p>
      </section>
    </div>
  );
}
