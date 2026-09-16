"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import {
  InstagramIcon,
  WhatsappIcon,
  MenuBookIcon,
  SymplaIcon,
  MapPinIcon,
} from "@/components/SocialIcons";

const links = [
  { href: "/", label: "Home", emoji: "🏠", desc: "Voltar ao início" },
  { href: "/eventos", label: "Programação", emoji: "🎸", desc: "Shows e eventos" },
  { href: "/galeria", label: "Galeria", emoji: "📸", desc: "Fotos da casa" },
  { href: "/evento-privado", label: "Evento Privado", emoji: "🎉", desc: "Reserve o pub" },
];

export default function Navbar({ cardapioUrl = SITE.cardapio }: { cardapioUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/95 backdrop-blur-md border-b border-green/25 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]"
          : "bg-gradient-to-b from-ink/90 to-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt={SITE.nome}
            width={52}
            height={52}
            className="rounded-full ring-1 ring-green/40 group-hover:ring-green-light transition"
          />
          <span className="font-display text-2xl md:text-3xl leading-none hidden sm:inline-flex items-center gap-2">
            <span className="text-green-glow">The Mulligan&apos;s</span>{" "}
            <span className="text-bone">Pub</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-7 items-center">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative font-medium tracking-wide transition-colors ${
                  active ? "text-green-light" : "text-bone-dim hover:text-bone"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-green-light transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}

          <div className="flex items-center gap-3 pl-3 border-l border-green/20">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-bone-dim hover:text-green-light transition"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-bone-dim hover:text-green-light transition"
            >
              <WhatsappIcon className="w-5 h-5" />
            </a>
          </div>

          <a
            href={cardapioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green hover:btn-green-hover text-sm !py-2 !px-5"
          >
            <MenuBookIcon className="w-4 h-4" />
            Cardápio
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen(!open)}
          className={`md:hidden inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
            open
              ? "btn-primary hover:btn-primary-hover"
              : "btn-green hover:btn-green-hover"
          }`}
        >
          <span className={`menu-bars ${open ? "menu-bars-open" : ""}`} aria-hidden="true">
            <span className={`menu-bars-line ${open ? "menu-bars-line-open-top" : ""}`} />
            <span className={`menu-bars-line ${open ? "menu-bars-line-open-mid" : ""}`} />
            <span className={`menu-bars-line ${open ? "menu-bars-line-open-bottom" : ""}`} />
          </span>
          {open ? "Fechar" : "Menu"}
        </button>
      </nav>

      {/* ================= MENU MOBILE (estilo Linktree) ================= */}
      <div
        id="menu-mobile"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[85vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-6 pt-3 border-t border-green/15 bg-ink/98 backdrop-blur">
          {/* Navegação principal — botões grandes e visuais */}
          <div className="flex flex-col gap-3">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 transition active:scale-[0.98] ${
                    active
                      ? "border-orange bg-orange/15 text-bone"
                      : "border-green/25 bg-charcoal text-bone hover:border-green-light/60"
                  }`}
                >
                  <span className="text-2xl shrink-0">{l.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-display text-xl leading-tight">{l.label}</span>
                    <span className="block text-xs text-bone-dim">{l.desc}</span>
                  </span>
                  <span className="text-green-light text-lg shrink-0">→</span>
                </Link>
              );
            })}
          </div>

          {/* Ações rápidas — cardápio, ingressos, redes */}
          <div className="mt-5 pt-5 border-t border-green/15">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-green-light/70 mb-3">
              Acesso rápido
            </p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={cardapioUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green/25 bg-charcoal px-3 py-4 text-bone hover:border-green-light/60 transition active:scale-[0.98]"
              >
                <MenuBookIcon className="w-6 h-6 text-green-light" />
                <span className="text-sm font-medium">Cardápio</span>
              </a>
              <a
                href={SITE.sympla}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green/25 bg-charcoal px-3 py-4 text-bone hover:border-green-light/60 transition active:scale-[0.98]"
              >
                <SymplaIcon className="w-6 h-6 text-green-light" />
                <span className="text-sm font-medium">Ingressos</span>
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green/25 bg-charcoal px-3 py-4 text-bone hover:border-green-light/60 transition active:scale-[0.98]"
              >
                <InstagramIcon className="w-6 h-6 text-green-light" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green/25 bg-charcoal px-3 py-4 text-bone hover:border-green-light/60 transition active:scale-[0.98]"
              >
                <WhatsappIcon className="w-6 h-6 text-green-light" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>

            {/* Endereço com link para o mapa */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                SITE.endereco,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center gap-3 rounded-xl border border-green/15 bg-charcoal/60 px-4 py-3 text-bone-dim hover:text-bone transition"
            >
              <MapPinIcon className="w-5 h-5 text-green-light shrink-0" />
              <span className="text-xs leading-snug">{SITE.endereco}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
