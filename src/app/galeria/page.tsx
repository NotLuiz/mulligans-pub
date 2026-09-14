import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Galeria",
  description: "Momentos no The Mulligan's Pub — shows, comida, drinks e a nossa casa.",
};

type Foto = { id: string; imagem_url: string; titulo?: string | null; categoria?: string };

async function getFotos(): Promise<Foto[]> {
  try {
    const { data, error } = await supabase
      .from("galeria")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as Foto[]) || [];
  } catch {
    return [];
  }
}

export default async function GaleriaPage() {
  const fotos = await getFotos();

  return (
    <div>
      {/* Cabeçalho */}
      <section className="relative py-20 border-b border-green/15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-ink" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-orange/15 blur-[110px]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <span className="kicker justify-center mb-4">
            <span className="h-px w-8 bg-green-light" />
            Nossa casa
            <span className="h-px w-8 bg-green-light" />
          </span>
          <h1 className="font-display text-6xl md:text-7xl text-grunge mb-3">Galeria</h1>
          <p className="text-bone-dim max-w-lg mx-auto">Momentos na casa 🍻</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {fotos.length === 0 ? (
          <div className="card-rustic p-12 text-center text-bone-dim">
            Em breve novidades por aqui.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
            {fotos.map((f) => (
              <div
                key={f.id}
                className="relative mb-3 rounded-xl overflow-hidden group border border-green/15 break-inside-avoid"
              >
                <Image
                  src={f.imagem_url}
                  alt={f.titulo?.trim() || "Foto do The Mulligan's Pub"}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="w-full h-auto object-cover photo-bw group-hover:photo-bw-hover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                {f.titulo?.trim() && (
                  <p className="absolute bottom-3 left-3 font-display text-lg text-bone opacity-0 group-hover:opacity-100 transition">
                    {f.titulo}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
