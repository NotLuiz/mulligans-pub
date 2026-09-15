import { supabase } from "@/lib/supabase";
import Calendar from "@/components/Calendar";
import Image from "next/image";
import { SITE, formatarDataHora } from "@/lib/site";
import { SymplaIcon } from "@/components/SocialIcons";
import BotaoSympla from "@/components/BotaoSympla";

export const revalidate = 60;

export const metadata = {
  title: "Programação",
  description: "Confira os próximos shows e eventos do The Mulligan's Pub em Belo Horizonte.",
};

type Evento = {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  imagem_url?: string;
  link_sympla?: string;
};

async function getEventos(): Promise<Evento[]> {
  try {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .eq("publicado", true)
      .order("data", { ascending: true });
    if (error) return [];
    return (data as Evento[]) || [];
  } catch {
    return [];
  }
}

export default async function EventosPage() {
  const lista = await getEventos();
  const futuros = lista.filter((e) => new Date(e.data) >= new Date());

  return (
    <div>
      {/* Cabeçalho */}
      <section className="relative py-20 border-b border-green/15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-ink" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-orange/15 blur-[110px]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <span className="kicker justify-center mb-4">
            <span className="h-px w-8 bg-green-light" />
            Agenda da casa
            <span className="h-px w-8 bg-green-light" />
          </span>
          <h1 className="font-display text-6xl md:text-7xl text-grunge mb-3">Programação</h1>
          <p className="text-bone-dim max-w-lg mx-auto">
            Escolha um dia no calendário ou veja a lista completa de shows abaixo.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-10">
        <Calendar eventos={lista} />

        <div>
          <h2 className="font-display text-4xl text-grunge mb-6 flex items-center gap-3">
            Próximos Shows
            <span className="h-px flex-1 bg-gradient-to-r from-green/60 to-transparent" />
          </h2>

          {futuros.length === 0 && (
            <div className="card-rustic p-8 text-center text-bone-dim">
              Nenhum evento agendado. Volte em breve! 🍻
            </div>
          )}

          <div className="space-y-4">
            {futuros.map((ev) => (
              <article
                key={ev.id}
                className="card-rustic hover:card-rustic-hover overflow-hidden flex flex-col sm:flex-row group"
              >
                {ev.imagem_url && (
                  <div className="relative sm:w-40 h-44 sm:h-auto shrink-0 overflow-hidden">
                    <Image
                      src={ev.imagem_url}
                      alt={ev.titulo || "Evento no The Mulligan's Pub"}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover photo-bw group-hover:photo-bw-hover"
                    />
                  </div>
                )}
                <div className="p-5 flex-1">
                  <p className="text-green-light text-xs font-semibold uppercase tracking-widest mb-1">
                    {formatarDataHora(ev.data)}
                  </p>
                  <h3 className="font-display text-2xl text-bone mb-1 group-hover:text-orange-light transition">
                    {ev.titulo}
                  </h3>
                  {ev.descricao && (
                    <p className="text-sm text-bone-dim line-clamp-2 mb-3">{ev.descricao}</p>
                  )}
                  {ev.link_sympla && (
                    <BotaoSympla
                      eventoId={ev.id}
                      href={ev.link_sympla}
                      className="btn-primary hover:btn-primary-hover text-sm !py-2 !px-4"
                    >
                      Comprar ingresso
                    </BotaoSympla>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Link do produtor no Sympla */}
          <div className="mt-10 card-rustic p-6 text-center">
            <p className="text-bone-dim text-sm mb-4">
              Quer ver todos os nossos eventos e comprar com antecedência?
            </p>
            <a
              href={SITE.sympla}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline hover:btn-outline-hover"
            >
              <SymplaIcon className="w-4 h-4" />
              Ver no Sympla
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
