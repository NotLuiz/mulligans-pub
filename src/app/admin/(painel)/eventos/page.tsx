"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatarDataHora } from "@/lib/site";

type Evento = {
  id: string;
  titulo: string;
  data: string;
  publicado: boolean;
  cliques_sympla?: number;
};

export default function EventosAdmin() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("data", { ascending: false });
    if (error) setErro("Não foi possível carregar os eventos.");
    setEventos((data as Evento[]) || []);
    setLoading(false);
  }
  useEffect(() => {
    (async () => {
      await carregar();
    })();
  }, []);

  async function excluir(id: string) {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) return alert("Erro ao excluir: " + error.message);
    carregar();
  }

  return (
    <div className="animate-rise">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="kicker mb-2">
            <span className="h-px w-6 bg-green-light" />
            Gerenciar
          </span>
          <h1 className="font-display text-5xl text-bone">Eventos</h1>
        </div>
        <Link href="/admin/eventos/novo" className="btn-primary hover:btn-primary-hover text-sm">
          + Novo Evento
        </Link>
      </div>

      {erro && <p className="text-orange-light mb-4">{erro}</p>}

      {loading ? (
        <p className="text-bone-dim">Carregando...</p>
      ) : eventos.length === 0 ? (
        <div className="card-rustic p-10 text-center text-bone-dim">
          Nenhum evento cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.map((ev) => (
            <div
              key={ev.id}
              className="card-rustic p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <p className="text-green-light text-xs font-semibold uppercase tracking-widest">
                  {formatarDataHora(ev.data)}
                </p>
                <p className="font-display text-2xl text-bone">{ev.titulo}</p>
                <p className="text-xs text-bone-dim flex items-center gap-3 flex-wrap">
                  <span>{ev.publicado ? "✅ Publicado" : "📝 Rascunho"}</span>
                  <span
                    className="inline-flex items-center gap-1 text-orange-light"
                    title="Cliques no botão de ingresso (Sympla)"
                  >
                    🎟️ {ev.cliques_sympla ?? 0}{" "}
                    {(ev.cliques_sympla ?? 0) === 1 ? "clique" : "cliques"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/eventos/${ev.id}`}
                  className="btn-outline hover:btn-outline-hover text-sm !py-2 !px-4"
                >
                  Editar
                </Link>
                <button
                  onClick={() => excluir(ev.id)}
                  className="bg-orange-dark hover:bg-orange text-white px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
