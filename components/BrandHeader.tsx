import Image from "next/image";
import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="brandHeader">
      <div className="brandTopRow">
        <Link href="/" className="brandIdentity" aria-label="Página inicial do Presença Querida">
          <Image src="/logo-presenca-querida.svg" alt="Presença Querida" className="brandMark" width={92} height={92} priority />
          <strong>Presença Querida</strong>
        </Link>
        <nav className="brandNav" aria-label="Navegação principal">
          <Link href="/cliente/daniela-50">Cliente</Link>
          <Link href="/gestao">Gestão</Link>
        </nav>
      </div>

      <a className="devStrip" href="https://automacaoextrema.com" target="_blank" rel="noreferrer">
        <strong>Desenvolvido por</strong>
        <Image src="/ae-logo.png" alt="Automação Extrema" className="devLogo" width={228} height={53} />
        <span>Clique no logo e nos conheça</span>
      </a>
    </header>
  );
}
