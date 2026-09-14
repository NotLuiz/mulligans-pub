"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { localParaISO, isoParaLocalInput } from "@/lib/site";

type Props = { id?: string };

const MAX_MB = 5;

function sanitizeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

export default function EventoForm({ id }: Props) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("The Mulligan's Pub");
  const [link, setLink] = useState("");
  const [publicado, setPublicado] = useState(true);
  const [imagemUrl, setImagemUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase
      .from("eventos")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data: ev, error }) => {
        if (error || !ev) return;
        setTitulo(ev.titulo);
        setDescricao(ev.descricao || "");
        // Converte o ISO (UTC) para o formato do input, já no fuso de Brasília.
        setData(isoParaLocalInput(ev.data));
        setLocal(ev.local || "The Mulligan's Pub");
        setLink(ev.link_sympla || "");
        setPublicado(ev.publicado);
        setImagemUrl(ev.imagem_url || "");
      });
  }, [id]);

  async function uploadImagem(file: File) {
    setErro("");
    if (!file.type.startsWith("image/")) {
      setErro("Envie apenas arquivos de imagem.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErro(`A imagem deve ter no máximo ${MAX_MB}MB.`);
      return;
    }
    setUploading(true);
    const nomeArq = `${Date.now()}-${sanitizeName(file.name)}`;
    const { error } = await supabase.storage.from("flyers").upload(nomeArq, file);
    if (error) {
      setErro("Erro ao subir imagem: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("flyers").getPublicUrl(nomeArq);
    setImagemUrl(data.publicUrl);
    setUploading(false);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    const payload = {
      titulo,
      descricao,
      // O input datetime-local está no horário de Brasília; convertemos
      // para UTC corretamente (evita o evento "pular" 3 horas).
      data: localParaISO(data),
      local,
      link_sympla: link || null,
      imagem_url: imagemUrl || null,
      publicado,
    };

    const { error } = id
      ? await supabase.from("eventos").update(payload).eq("id", id)
      : await supabase.from("eventos").insert(payload);

    setSalvando(false);
    if (error) return setErro("Erro: " + error.message);
    router.push("/admin/eventos");
    router.refresh();
  }

  const inputClass =
    "w-full bg-charcoal border border-green/25 rounded-md px-3 py-2.5 text-bone outline-none focus:border-orange transition";

  return (
    <form onSubmit={salvar} className="max-w-2xl space-y-5 animate-rise">
      <div>
        <label className="block text-sm mb-1 text-bone-dim">Título do Evento *</label>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Noite do Rock Clássico"
          className={inputClass}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-bone-dim">Data e Hora *</label>
          <input
            required
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-bone-dim">Local</label>
          <input value={local} onChange={(e) => setLocal(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-bone-dim">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-bone-dim">Link do Sympla</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.sympla.com.br/..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-bone-dim">Flyer do Evento</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && uploadImagem(e.target.files[0])}
          className="text-sm text-bone-dim file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-charcoal file:text-bone file:cursor-pointer hover:file:bg-charcoal-light"
        />
        {uploading && <p className="text-sm text-green-light mt-2">Enviando imagem...</p>}
        {imagemUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagemUrl}
            alt="Prévia"
            className="mt-3 w-40 rounded-md border border-green/25"
          />
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={publicado}
          onChange={(e) => setPublicado(e.target.checked)}
          className="accent-[#f97316] w-4 h-4"
        />
        <span className="text-sm text-bone-dim">
          Publicar no site (desmarque para salvar como rascunho)
        </span>
      </label>

      {erro && <p className="text-orange-light text-sm">{erro}</p>}

      <div className="flex gap-3">
        <button
          disabled={salvando || uploading}
          type="submit"
          className="btn-primary hover:btn-primary-hover disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {salvando ? "Salvando..." : "Salvar Evento"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline hover:btn-outline-hover"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
