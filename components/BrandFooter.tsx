import Image from "next/image";
import Link from "next/link";

const whatsappHref = "https://wa.me/5519989848246?text=Ol%C3%A1!%20Vim%20pelo%20Presen%C3%A7a%20Querida%20e%20quero%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20da%20Automa%C3%A7%C3%A3o%20Extrema.";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/automacaoextrema" },
  { label: "Facebook", href: "https://www.facebook.com/automacaoextrema" },
  { label: "TikTok", href: "https://www.tiktok.com/@automacaoextrema" },
  { label: "YouTube", href: "https://www.youtube.com/@automacaoextrema" }
];

export function BrandFooter() {
  return (
    <footer className="brandFooter">
      <div className="footerGrid">
        <div className="footerBrand">
          <Image src="/logo-presenca-querida.svg" alt="Presença Querida" width={54} height={54} />
          <div>
            <strong>Presença Querida</strong>
            <p>Gestão afetiva de presença para transformar confirmações em tranquilidade, carinho e memória.</p>
          </div>
        </div>

        <div>
          <h3>Navegação</h3>
          <Link href="/#opcoes-aquisicao">Opções de aquisição</Link>
          <Link href="/login">Acesso para clientes</Link>
          <Link href="/privacidade">Privacidade</Link>
        </div>

        <div>
          <h3>Automação Extrema</h3>
          <p>Presença Querida é uma solução desenvolvida pela Automação Extrema.</p>
          <Link href="https://automacaoextrema.com" target="_blank" rel="noreferrer">Conhecer a Automação Extrema</Link>
          <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp: (19) 98984-8246</a>
        </div>

        <div>
          <h3>Redes sociais</h3>
          <div className="socialLinks">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="footerBottom">
        <span>© 2026 Presença Querida • Automação Extrema</span>
        <span>Convites, presença e memória com cuidado.</span>
      </div>
      <a className="floatingWhatsapp" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
    </footer>
  );
}
