import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE, EVENTO_PRIVADO_OCASIOES, EVENTO_PRIVADO_INCLUSO } from "@/lib/site";
import { MapPinIcon, WhatsappIcon } from "@/components/SocialIcons";
import EventoPrivadoForm from "@/components/EventoPrivadoForm";

export const metadata: Metadata = {
  title: "Eventos Privados",
  description:
    "Reserve o Mulligan's Pub para o seu evento privado: aniversários, confraternizações e eventos corporativos com estrutura completa em Belo Horizonte.",
};

export default function EventoPrivadoPage() {
  return (
    <div className="overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative py-24 md:py-32 border-b border-green/15 overflow-hidden">
        <Image
          src="/banda.jpg"
          alt="Evento privado no Mulligan's Pub"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-orange/20 blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-rise">
          <span className="kicker justify-center mb-4">
            <span className="h-px w-8 bg-green-light" />
            Espaço exclusivo
            <span className="h-px w-8 bg-green-light" />
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-grunge mb-6">
            Eventos <span className="text-green-glow">Privados</span>
          </h1>
          <p className="text-bone-dim text-lg max-w-2xl mx-auto leading-relaxed">
            Reserve o Mulligan&apos;s só para o seu grupo. Estrutura completa, cardápio
            personalizado e uma equipe dedicada para fazer do seu evento um momento
            inesquecível.
          </p>
        </div>
      </section>

      {/* ================= OCASIÕES ================= */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EVENTO_PRIVADO_OCASIOES.map((oc) => (
            <div key={oc.titulo} className="card-rustic hover:card-rustic-hover p-6 text-center">
              <span className="text-4xl block mb-3">{oc.icone}</span>
              <p className="text-bone font-semibold text-sm">{oc.titulo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= O QUE ESTÁ INCLUSO + FORM ================= */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="kicker mb-3">
              <span className="h-px w-6 bg-green-light" />
              O que oferecemos
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-grunge mb-6">
              Tudo pronto para a sua festa
            </h2>

            <ul className="space-y-4 mb-10">
              {EVENTO_PRIVADO_INCLUSO.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-orange text-lg leading-none mt-0.5">✦</span>
                  <span className="text-bone-dim">{item}</span>
                </li>
              ))}
            </ul>

            <div className="card-rustic p-6">
              <p className="text-bone-dim text-sm mb-3 flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-green-light shrink-0" />
                {SITE.endereco}
              </p>
              <p className="text-bone-dim text-sm">
                Prefere falar direto? Chame no WhatsApp e a gente monta o orçamento com você.
              </p>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-green hover:btn-green-hover mt-4 w-full"
              >
                <WhatsappIcon className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div>
            <span className="kicker mb-3">
              <span className="h-px w-6 bg-green-light" />
              Solicite seu orçamento
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-grunge mb-6">
              Conte sobre o seu evento
            </h2>
            <EventoPrivadoForm />
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="relative py-20 text-center border-t border-green/15 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-green/15 blur-[120px]" />
        <div className="relative z-10 px-4">
          <h2 className="font-display text-4xl md:text-6xl text-grunge mb-4">
            Vamos fazer acontecer
          </h2>
          <p className="text-bone-dim mb-8 max-w-lg mx-auto">
            Confira também nossa programação de eventos abertos ao público.
          </p>
          <Link href="/eventos" className="btn-outline hover:btn-outline-hover">
            Ver Programação
          </Link>
        </div>
      </section>
    </div>
  );
}
