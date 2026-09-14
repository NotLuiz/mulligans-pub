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
  IrelandFlagIcon,
} from "@/components/SocialIcons";

const links = [
  { href: "/", label: "Home" },
  { href: "/eventos", label: "Programação" },
  { href: "/galeria", label: "Galeria" },
  { href: "/evento-privado", label: "Evento Privado" },
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
            <span className="text-green-glow">The Mulligan's</span>{" "}
            <span className="text-bone">Pub</span>
            <IrelandFlagIcon className="w-6 h-4 rounded-[2px] shadow-sm" />
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
          aria-label="Abrir menu"
          aria-expanded={open}
          className="md:hidden text-2xl text-bone"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-5 pt-3 flex flex-col gap-4 border-t border-green/15 bg-ink/98 backdrop-blur">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`tracking-wide ${
                pathname === l.href ? "text-green-light" : "text-bone-dim"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <div className="flex items-center gap-5 pt-2 border-t border-green/15">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-bone-dim hover:text-green-light transition"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-bone-dim hover:text-green-light transition"
            >
              <WhatsappIcon className="w-6 h-6" />
            </a>
          </div>

          <a
            href={cardapioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green text-sm w-fit"
          >
            <MenuBookIcon className="w-4 h-4" />
            Cardápio
          </a>
        </div>
      </div>
    </header>
  );
}
