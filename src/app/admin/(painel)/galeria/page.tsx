"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Foto = { id: string; imagem_url: string; titulo: string; categoria: string };

const MAX_MB = 8;

function sanitizeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

export default function GaleriaAdmin() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("geral");
  const [uploading, setUploading] = useState(false);
  const [progresso, setProgresso] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    const { data, error } = await supabase
      .from("galeria")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErro("Não foi possível carregar a galeria.");
    setFotos((data as Foto[]) || []);
  }
  useEffect(() => {
    carregar();
  }, []);

  async function upload(files: FileList) {
    setErro("");
    const arquivos = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) {
        setErro(`"${f.name}" não é uma imagem válida.`);
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setErro(`"${f.name}" excede ${MAX_MB}MB.`);
        return false;
      }
      return true;
    });
    if (arquivos.length === 0) return;

    setUploading(true);
    for (let i = 0; i < arquivos.length; i++) {
      const file = arquivos[i];
      setProgresso(`Enviando ${i + 1} de ${arquivos.length}...`);
      const nomeArq = `${Date.now()}-${i}-${sanitizeName(file.name)}`;
      const { error } = await supabase.storage.from("galeria").upload(nomeArq, file);
      if (error) {
        setErro("Erro ao enviar: " + error.message);
        continue;
      }
      const { data } = supabase.storage.from("galeria").getPublicUrl(nomeArq);
      await supabase.from("galeria").insert({
        imagem_url: data.publicUrl,
        // Sem título informado, salva null (não usa o nome do arquivo,
        // que apareceria como legenda estranha na galeria pública).
        titulo: titulo.trim() || null,
        categoria,
      });
    }
    setTitulo("");
    setProgresso("");
    setUploading(false);
    carregar();
  }

  async function excluir(foto: Foto) {
    if (!confirm("Excluir esta foto?")) return;
    try {
      const nomeArq = decodeURIComponent(foto.imagem_url.split("/").pop()!.split("?")[0]);
      await supabase.storage.from("galeria").remove([nomeArq]);
    } catch {
      /* segue para remover o registro mesmo se o arquivo não for encontrado */
    }
    const { error } = await supabase.from("galeria").delete().eq("id", foto.id);
    if (error) return alert("Erro ao excluir: " + error.message);
    carregar();
  }

  const inputClass =
    "w-full bg-charcoal border border-green/25 rounded-md px-3 py-2.5 text-bone outline-none focus:border-orange transition";

  return (
    <div className="animate-rise">
      <span className="kicker mb-2">
        <span className="h-px w-6 bg-green-light" />
        Gerenciar
      </span>
      <h1 className="font-display text-5xl text-bone mb-8">Galeria</h1>

      <div className="card-rustic p-6 mb-10 max-w-2xl">
        <h2 className="font-display text-2xl text-bone mb-4">Adicionar novas fotos</h2>
        <input
          placeholder="Título (opcional)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={`${inputClass} mb-3`}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={`${inputClass} mb-3`}
        >
          <option value="geral">Geral</option>
          <option value="shows">Shows</option>
          <option value="comida">Comida & Bebida</option>
          <option value="o-pub">O Pub</option>
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => e.target.files && upload(e.target.files)}
          className="text-sm text-bone-dim file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-charcoal file:text-bone file:cursor-pointer hover:file:bg-charcoal-light"
        />
        {progresso && <p className="text-sm text-green-light mt-3">{progresso}</p>}
        {erro && <p className="text-sm text-orange-light mt-3">{erro}</p>}
      </div>

      {fotos.length === 0 ? (
        <div className="card-rustic p-10 text-center text-bone-dim">
          Nenhuma foto na galeria ainda.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fotos.map((f) => (
            <div
              key={f.id}
              className="relative aspect-square rounded-xl overflow-hidden group border border-green/15"
            >
              <Image
                src={f.imagem_url}
                alt={f.titulo}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={() => excluir(f)}
                  aria-label="Excluir foto"
                  className="bg-orange hover:bg-orange-light w-9 h-9 rounded-full text-white text-sm font-bold transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
