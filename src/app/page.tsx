import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import {
  SITE,
  whatsappLink,
  mapsLink,
  textoHorario,
  formatarDiaMes,
  formatarDiaSemanaHora,
  ANIVERSARIO_PADRAO,
  ANIVERSARIO_VOUCHER_PADRAO,
  EVENTO_PRIVADO_OCASIOES,
} from "@/lib/site";
import {
  InstagramIcon,
  WhatsappIcon,
  SymplaIcon,
  MenuBookIcon,
  MapPinIcon,
  IrelandFlagIcon,
} from "@/components/SocialIcons";
import BotaoSympla from "@/components/BotaoSympla";

export const revalidate = 60;

type Evento = {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  imagem_url?: string;
  link_sympla?: string;
};

type Foto = { id: string; imagem_url: string; titulo?: string | null };

type Config = {
  texto_sobre?: string;
  link_cardapio?: string;
  endereco?: string;
  endereco_completo?: string;
  horario_funcionamento?: string;
  horarios?: unknown;
  instagram?: string;
  link_sympla?: string;
  aniversario_titulo?: string;
  aniversario_condicoes?: string;
  aniversario_voucher?: string;
  evento_privado_texto?: string;
};

async function getData() {
  try {
    const [eventosRes, galeriaRes, configRes] = await Promise.all([
      supabase
        .from("eventos")
        .select("*")
        .eq("publicado", true)
        .gte("data", new Date().toISOString())
        .order("data")
        .limit(3),
      supabase.from("galeria").select("*").order("created_at", { ascending: false }).limit(6),
      supabase.from("configuracoes").select("*").maybeSingle(),
    ]);

    return {
      eventos: (eventosRes.data as Evento[]) || [],
      galeria: (galeriaRes.data as Foto[]) || [],
      config: (configRes.data as Config) || {},
    };
  } catch {
    return { eventos: [] as Evento[], galeria: [] as Foto[], config: {} as Config };
  }
}

const mosaico = [
  { src: "/banda.jpg", alt: "Show ao vivo", label: "Shows ao vivo", big: true },
  { src: "/telefone.jpg", alt: "Cabine telefônica", label: "O cantinho", big: false },
  { src: "/burger.jpg", alt: "Burger artesanal", label: "Cozinha", big: false },
  { src: "/drinks.jpg", alt: "Drinks", label: "Bar", big: false },
  { src: "/hero.jpg", alt: "O Pub", label: "A casa", big: false },
];

export default async function Home() {
  const { eventos, galeria, config } = await getData();

  const cardapioUrl = config.link_cardapio || SITE.cardapio;
  const symplaUrl = config.link_sympla || SITE.sympla;
  const instagramUrl = config.instagram
    ? `https://instagram.com/${config.instagram.replace("@", "")}`
    : SITE.instagram;
  const endereco = config.endereco_completo || config.endereco || SITE.endereco;

  return (
    <div className="overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="The Mulligan's Pub"
          fill
          sizes="100vw"
          className="object-cover opacity-40 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
        <div className="absolute inset-0 vignette" />

        {/* brilho de fundo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-orange/20 blur-[120px]" />

        <div className="relative z-10 px-4 animate-rise">
          <div className="kicker justify-center mb-6">
            <span className="h-px w-8 bg-green-light" />
            <IrelandFlagIcon className="w-6 h-4 rounded-[2px] shadow" />
            {SITE.selo} · Desde {SITE.desde}
            <span className="h-px w-8 bg-green-light" />
          </div>

          <Image
            src="/logo.png"
            alt="The Mulligan's Pub"
            width={180}
            height={180}
            className="mx-auto mb-8 w-auto h-auto drop-shadow-[0_0_35px_rgba(249,115,22,0.45)]"
            priority
          />

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-6">
            <span className="text-grunge-green">The Mulligan&apos;s</span>
            <br />
            <span className="text-grunge">Pub</span>
          </h1>

          <p className="text-green-light tracking-[0.45em] text-xs md:text-sm mb-6 uppercase">
            {SITE.tagline}
          </p>

          <p className="text-bone-dim text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {config.texto_sobre || SITE.descricao}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/eventos" className="btn-primary hover:btn-primary-hover">
              Ver Programação
            </Link>
            <a
              href={cardapioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline hover:btn-outline-hover"
            >
              <MenuBookIcon className="w-4 h-4" />
              Cardápio
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-green-light/60 text-2xl animate-bounce">
          ↓
        </div>
      </section>

      {/* ================= FAIXA MARQUEE ================= */}
      <section className="border-y border-green/20 bg-ink-soft py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {["Beer", "Food", "Music", "Good Moments", "Belo Horizonte"].map((w) => (
                <span
                  key={w}
                  className="mx-8 font-display text-2xl text-bone-dim/70 flex items-center gap-8"
                >
                  {w}
                  <span className="text-orange text-lg">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRÓXIMOS EVENTOS ================= */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="kicker mb-3">
              <span className="h-px w-6 bg-green-light" />
              Agenda
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-grunge">Próximos Eventos</h2>
          </div>
          <Link
            href="/eventos"
            className="text-green-light hover:text-orange-light text-sm transition"
          >
            Ver todos →
          </Link>
        </div>

        {eventos.length === 0 ? (
          <div className="card-rustic p-10 text-center">
            <p className="text-bone-dim">
              Nenhum evento agendado por enquanto. Volte em breve! 🍻
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {eventos.map((ev) => (
              <article
                key={ev.id}
                className="card-rustic hover:card-rustic-hover overflow-hidden group flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  {ev.imagem_url ? (
                    <Image
                      src={ev.imagem_url}
                      alt={ev.titulo || "Evento no The Mulligan's Pub"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover photo-bw group-hover:photo-bw-hover"
                    />
                  ) : (
                    <div className="h-full bg-charcoal flex items-center justify-center text-bone-dim/50">
                      Sem imagem
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {formatarDiaMes(ev.data)}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-green-light text-xs font-semibold uppercase tracking-widest mb-2">
                    {formatarDiaSemanaHora(ev.data)}
                  </p>
                  <h3 className="font-display text-2xl text-bone mb-3 group-hover:text-orange-light transition">
                    {ev.titulo}
                  </h3>
                  {ev.descricao && (
                    <p className="text-bone-dim text-sm line-clamp-2 mb-4">{ev.descricao}</p>
                  )}
                  {ev.link_sympla && (
                    <BotaoSympla
                      eventoId={ev.id}
                      href={ev.link_sympla}
                      className="btn-primary hover:btn-primary-hover text-sm mt-auto w-fit"
                    >
                      Comprar ingresso
                    </BotaoSympla>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= A CASA ================= */}
      <section className="relative py-20 bg-ink-soft border-y border-green/15">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="kicker mb-3">
                <span className="h-px w-6 bg-green-light" />
                O espaço
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-grunge">A Casa</h2>
              <p className="text-bone-dim text-sm mt-2 flex items-center gap-2">
                <IrelandFlagIcon className="w-5 h-3.5 rounded-[2px]" />
                Um autêntico pub em BH 🍻
              </p>
            </div>
            <Link
              href="/galeria"
              className="text-green-light hover:text-orange-light text-sm transition"
            >
              Ver galeria →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
            {mosaico.map((m) => (
              <div
                key={m.src}
                className={`relative rounded-xl overflow-hidden group border border-green/15 ${
                  m.big ? "col-span-2 row-span-2" : ""
                }`}
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover photo-bw group-hover:photo-bw-hover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                <p
                  className={`absolute bottom-4 left-4 font-display text-bone ${
                    m.big ? "text-3xl" : "text-xl"
                  }`}
                >
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ANIVERSÁRIO ================= */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="card-rustic overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[280px]">
              <Image
                src="/drinks.jpg"
                alt="Comemore seu aniversário no Mulligan's"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink/80" />
              <span className="absolute top-5 left-5 text-5xl">🎂</span>
            </div>

            <div className="p-8 md:p-12">
              <span className="kicker mb-3">
                <span className="h-px w-6 bg-green-light" />
                Comemore com a gente
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-grunge mb-4">
                {config.aniversario_titulo || "Seu Aniversário no Mulligan's"}
              </h2>
              <p className="text-bone-dim mb-8 leading-relaxed">
                Reúna a galera e comemore do jeito certo: cerveja gelada, boa comida e a
                melhor atmosfera de BH.
              </p>

              <ul className="space-y-4 mb-8">
                {ANIVERSARIO_PADRAO.map((item) => (
                  <li key={item.titulo} className="flex gap-4">
                    <span className="text-2xl shrink-0">{item.icone}</span>
                    <div>
                      <p className="text-bone font-semibold">{item.titulo}</p>
                      <p className="text-bone-dim text-sm">{item.descricao}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-lg border border-green/25 bg-green/5 p-5 mb-8">
                <p className="text-green-light font-semibold text-sm uppercase tracking-widest mb-3">
                  🎟️ Voucher por número de pessoas
                </p>
                <ul className="space-y-2">
                  {(config.aniversario_voucher
                    ? config.aniversario_voucher.split("\n").filter(Boolean)
                    : ANIVERSARIO_VOUCHER_PADRAO
                  ).map((linha) => (
                    <li key={linha} className="flex gap-2 text-bone-dim text-sm">
                      <span className="text-green-light shrink-0">✓</span>
                      <span>{linha}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={whatsappLink(
                  "Olá! Gostaria de saber mais sobre a promoção de aniversário no Mulligan's Pub."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary hover:btn-primary-hover"
              >
                <WhatsappIcon className="w-4 h-4" />
                Reservar minha festa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENTO PRIVADO ================= */}
      <section className="relative py-20 bg-ink-soft border-y border-green/15">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="kicker justify-center mb-3">
              <span className="h-px w-6 bg-green-light" />
              Espaço exclusivo
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-grunge mb-4">
              Eventos Privados
            </h2>
            <p className="text-bone-dim max-w-2xl mx-auto leading-relaxed">
              {config.evento_privado_texto ||
                "Que tal reservar o Mulligan's só para o seu grupo? Organizamos eventos privados com estrutura completa, cardápio personalizado e atendimento dedicado."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {EVENTO_PRIVADO_OCASIOES.map((oc) => (
              <div
                key={oc.titulo}
                className="card-rustic hover:card-rustic-hover p-6 text-center"
              >
                <span className="text-4xl block mb-3">{oc.icone}</span>
                <p className="text-bone font-semibold text-sm">{oc.titulo}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/evento-privado" className="btn-green hover:btn-green-hover">
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ÚLTIMOS MOMENTOS ================= */}
      {galeria.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="kicker mb-3">
                <span className="h-px w-6 bg-green-light" />
                Galeria
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-grunge">Últimos Momentos</h2>
            </div>
            <Link
              href="/galeria"
              className="text-green-light hover:text-orange-light text-sm transition"
            >
              Ver galeria →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galeria.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-xl overflow-hidden group border border-green/15"
              >
                <Image
                  src={img.imagem_url}
                  alt={img.titulo?.trim() || "Foto do The Mulligan's Pub"}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover photo-bw group-hover:photo-bw-hover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CTA FINAL ================= */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-charcoal to-ink" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange/15 blur-[120px]" />
        <div className="relative z-10 px-4">
          <h2 className="font-display text-5xl md:text-7xl text-grunge mb-4">
            Nos vemos no <span className="text-green-glow">balcão</span>
          </h2>
          <a
            href={mapsLink(endereco)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone-dim hover:text-green-light transition mb-2 max-w-lg mx-auto flex items-center justify-center gap-2"
          >
            <MapPinIcon className="w-4 h-4 text-green-light shrink-0" />
            {endereco}
          </a>
          {textoHorario(config.horarios, config.horario_funcionamento) && (
            <p className="text-bone-dim/70 text-sm mb-8">
              {textoHorario(config.horarios, config.horario_funcionamento)}
            </p>
          )}

          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Link href="/eventos" className="btn-primary hover:btn-primary-hover">
              Ver Programação
            </Link>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline hover:btn-outline-hover"
            >
              <InstagramIcon className="w-4 h-4" />
              Instagram
            </a>
            <a
              href={symplaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline hover:btn-outline-hover"
            >
              <SymplaIcon className="w-4 h-4" />
              Sympla
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
