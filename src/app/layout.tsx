import type { Metadata } from "next";
import "./globals.css";
import { BrandHeader } from "@/components/BrandHeader";

export const metadata: Metadata = {
  title: "Presença Querida",
  description: "Gestão afetiva de presenças para momentos importantes."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <BrandHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
