import type { Metadata } from "next";
import { Inter, Pirata_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const pirata = Pirata_One({ subsets: ["latin"], weight: "400", variable: "--font-pirata", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mulliganspub.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Mulligan's Pub — Belo Horizonte",
    template: "%s • The Mulligan's Pub",
  },
  description:
    "Purveyor of Good Moments. Cerveja gelada, comida de verdade e música ao vivo em Belo Horizonte. Confira a programação e garanta seu ingresso.",
  keywords: ["pub", "Belo Horizonte", "música ao vivo", "cerveja", "burger", "shows", "Mulligan's"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: SITE.nome,
    title: "The Mulligan's Pub — Belo Horizonte",
    description:
      "Purveyor of Good Moments. Cerveja gelada, comida de verdade e música ao vivo em Belo Horizonte.",
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: SITE.nome }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mulligan's Pub — Belo Horizonte",
    description: "Purveyor of Good Moments. Beer, Food & Music em Belo Horizonte.",
    images: ["/hero.jpg"],
  },
  // O favicon é gerado automaticamente pelo App Router a partir de src/app/icon.png
  // (a letra M do Mulligan's). Não é necessário declarar `icons` aqui.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${pirata.variable}`}>
      <body className="bg-ink text-bone font-sans antialiased">
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
