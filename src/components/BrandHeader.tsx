import Image from "next/image";
import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="brandHeader">
      <div className="brandTopRow">
        <Link href="/" className="brandIdentity" aria-label="Página inicial do Presença Querida">
          <Image
            src="/logo-presenca-querida.svg"
            alt="Presença Querida"
            width={92}
            height={92}
            className="brandMark"
            priority
          />
          <strong>Presença Querida</strong>
        </Link>
        <nav className="brandNav" aria-label="Navegação principal">
          <Link href="/cliente/daniela-50">Cliente</Link>
          <Link href="/gestao">Gestão</Link>
        </nav>
      </div>

      <a className="devStrip" href="https://automacaoextrema.com" target="_blank" rel="noreferrer">
        <strong>Desenvolvido por</strong>
        <Image
          src="/automacao-extrema-badge.svg"
          alt="Automação Extrema"
          width={224}
          height={52}
        />
        <span>Clique no logo e nos conheça</span>
      </a>
    </header>
  );
}
