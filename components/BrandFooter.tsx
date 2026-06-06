import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

function normalizeWhatsapp(number: string) {
  const onlyDigits = number.replace(/\D/g, "");
  return onlyDigits || "5519989848246";
}

function formatWhatsapp(number: string) {
  const digits = normalizeWhatsapp(number);
  if (digits === "5519989848246") return "(19) 98984-8246";
  return `+${digits}`;
}

function buildWhatsappHref(number: string) {
  const message = "Olá! Vim pelo Presença Querida e quero iniciar o diagnóstico para entender o melhor formato para meu evento.";
  return `https://wa.me/${normalizeWhatsapp(number)}?text=${encodeURIComponent(message)}`;
}

export async function BrandFooter() {
  const settings = await getSiteSettings();
  const whatsappHref = buildWhatsappHref(settings.whatsappNumber);
  const socialLinks = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "Facebook", href: settings.facebookUrl },
    { label: "TikTok", href: settings.tiktokUrl },
    { label: "YouTube", href: settings.youtubeUrl }
  ].filter((item) => item.href);

  return (
    <footer className="brandFooter">
      <div className="footerGrid">
        <div className="footerBrand">
          <Image src="/logo-presenca-querida.svg" alt="Presença Querida" width={54} height={54} />
          <div>
            <strong>{settings.solutionName}</strong>
            <p>{settings.solutionDescription}</p>
          </div>
        </div>

        <div>
          <h3>Navegação</h3>
          <Link href="/#opcoes-aquisicao">Opções de aquisição</Link>
          <Link href="/diagnostico">Diagnóstico</Link>
          <Link href="/login">Acesso para clientes</Link>
          <Link href="/privacidade">Privacidade</Link>
        </div>

        <div>
          <h3>Automação Extrema</h3>
          <p>{settings.solutionName} é uma solução desenvolvida pela Automação Extrema.</p>
          <Link href={settings.aeSiteUrl || "https://automacaoextrema.com"} target="_blank" rel="noreferrer">Conhecer a Automação Extrema</Link>
          <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp: {formatWhatsapp(settings.whatsappNumber)}</a>
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
        <span>© 2026 {settings.solutionName} • Automação Extrema</span>
        <span>{settings.footerNote}</span>
      </div>
      <a className="floatingWhatsapp" href={whatsappHref} target="_blank" rel="noreferrer">Fale no WhatsApp</a>
    </footer>
  );
}
