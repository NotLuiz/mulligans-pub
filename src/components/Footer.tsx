import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { SITE, whatsappLink, mapsLink, textoHorario } from "@/lib/site";
import {
  InstagramIcon,
  WhatsappIcon,
  SymplaIcon,
  MenuBookIcon,
  MapPinIcon,
  ClockIcon,
} from "@/components/SocialIcons";

type Config = {
  endereco?: string;
  endereco_completo?: string;
  horario_funcionamento?: string;
  horarios?: unknown;
  instagram?: string;
  whatsapp?: string;
  link_cardapio?: string;
  link_sympla?: string;
};

async function getConfig(): Promise<Config> {
  try {
    const { data, error } = await supabase.from("configuracoes").select("*").maybeSingle();
    if (error) return {};
    return (data as Config) || {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const config = await getConfig();
  const instagramHandle = (config.instagram || SITE.instagramHandle).replace("@", "");
  const endereco = config.endereco_completo || config.endereco || SITE.endereco;
  const cardapio = config.link_cardapio || SITE.cardapio;
  const sympla = config.link_sympla || SITE.sympla;
  const horario = textoHorario(config.horarios, config.horario_funcionamento);

  const sociais = [
    { href: `https://instagram.com/${instagramHandle}`, label: "Instagram", Icon: InstagramIcon },
    { href: whatsappLink(), label: "WhatsApp", Icon: WhatsappIcon },
    { href: sympla, label: "Sympla", Icon: SymplaIcon },
    { href: cardapio, label: "Cardápio", Icon: MenuBookIcon },
  ];

  return (
    <footer className="relative z-10 mt-24 border-t border-green/20 bg-ink-soft">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-orange/60 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt={SITE.nome}
              width={56}
              height={56}
              className="rounded-full ring-1 ring-green/40"
            />
            <h3 className="font-display text-3xl text-green-glow leading-none">{SITE.nome}</h3>
          </div>
          <p className="text-bone-dim text-sm leading-relaxed mb-3">
            {SITE.tagline} — desde {SITE.desde}.
            <br />
            Cerveja gelada, comida de verdade e música ao vivo no coração de BH.
          </p>
          <p className="flex items-center gap-2 text-green-light text-xs font-semibold uppercase tracking-[0.2em] mb-5">
            {SITE.selo}
          </p>

          <div className="flex items-center gap-3">
            {sociais.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-10 h-10 rounded-full border border-green/30 flex items-center justify-center text-bone-dim hover:text-green-light hover:border-green-light/60 transition"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="select-none">
          <h4 className="kicker mb-4">
            <span className="h-px w-6 bg-green-light" />
            Contato
          </h4>

          {/* Endereço — texto informativo + link explícito para o mapa */}
          <div className="flex items-start gap-2 mb-4">
            <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-green-light" />
            <div className="text-sm text-bone-dim">
              <p className="leading-relaxed">{endereco}</p>
              <a
                href={mapsLink(endereco)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-green-light hover:text-orange transition underline underline-offset-4 decoration-green-light/40"
              >
                Ver no Google Maps
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Horário de funcionamento */}
          {horario && (
            <div className="flex items-start gap-2 mb-4">
              <ClockIcon className="w-4 h-4 mt-0.5 shrink-0 text-green-light" />
              <div className="text-sm text-bone-dim">
                <p className="text-bone/80 font-medium mb-0.5">Horário</p>
                <p className="leading-relaxed">{horario}</p>
              </div>
            </div>
          )}

          {/* Redes e contato direto */}
          <div className="flex items-start gap-2">
            <InstagramIcon className="w-4 h-4 mt-0.5 shrink-0 text-green-light" />
            <div className="text-sm text-bone-dim">
              <p className="text-bone/80 font-medium mb-0.5">Redes</p>
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange transition"
              >
                @{instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="kicker mb-4">
            <span className="h-px w-6 bg-green-light" />
            Navegue
          </h4>
          <ul className="space-y-2 text-sm text-bone-dim">
            <li>
              <Link href="/eventos" className="hover:text-orange transition">
                Programação
              </Link>
            </li>
            <li>
              <Link href="/galeria" className="hover:text-orange transition">
                Galeria
              </Link>
            </li>
            <li>
              <Link href="/evento-privado" className="hover:text-orange transition">
                Evento Privado
              </Link>
            </li>
            <li>
              <a
                href={cardapio}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange transition"
              >
                Cardápio
              </a>
            </li>
            <li>
              <a
                href={sympla}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange transition"
              >
                Ingressos (Sympla)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-bone-dim/70">
          <span>
            © {new Date().getFullYear()} {SITE.nome} — BH
          </span>
          <span className="font-display text-base text-green-light/70">Beer · Food · Music</span>
        </div>
      </div>
    </footer>
  );
}
