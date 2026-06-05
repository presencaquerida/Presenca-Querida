import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presença Querida | Daniela 50 anos",
  description:
    "Convite, confirmação de presença e gestão afetiva para a festa de 50 anos da Daniela Mattano da Silva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
