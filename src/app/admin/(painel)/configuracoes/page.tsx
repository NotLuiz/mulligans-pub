"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DIAS_SEMANA,
  HORARIOS_PADRAO,
  normalizarHorarios,
  formatarHorarios,
  type Horarios,
} from "@/lib/site";

export default function ConfiguracoesAdmin() {
  const [form, setForm] = useState({
    link_cardapio: "",
    link_sympla: "",
    texto_sobre: "",
    endereco: "",
    endereco_completo: "",
    instagram: "",
    whatsapp: "",
    aniversario_titulo: "",
    aniversario_condicoes: "",
    aniversario_voucher: "",
    evento_privado_texto: "",
  });
  const [horarios, setHorarios] = useState<Horarios>(HORARIOS_PADRAO);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    supabase
      .from("configuracoes")
      .select("*")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setErro("Não foi possível carregar as configurações.");
        if (data) {
          setForm({
            link_cardapio: data.link_cardapio || "",
            link_sympla: data.link_sympla || "",
            texto_sobre: data.texto_sobre || "",
            endereco: data.endereco || "",
            endereco_completo: data.endereco_completo || "",
            instagram: data.instagram || "",
            whatsapp: data.whatsapp || "",
            aniversario_titulo: data.aniversario_titulo || "",
            aniversario_condicoes: data.aniversario_condicoes || "",
            aniversario_voucher: data.aniversario_voucher || "",
            evento_privado_texto: data.evento_privado_texto || "",
          });
          setHorarios(normalizarHorarios(data.horarios));
        }
        setLoading(false);
      });
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMsg("");
    setErro("");
    const { error } = await supabase
      .from("configuracoes")
      .upsert(
        { id: 1, ...form, horarios, horario_funcionamento: formatarHorarios(horarios) },
        { onConflict: "id" },
      );
    setSalvando(false);
    if (error) return setErro("Erro ao salvar: " + error.message);
    setMsg("✅ Salvo com sucesso!");
    setTimeout(() => setMsg(""), 3000);
  }

  function atualizarDia(
    key: keyof Horarios,
    campo: "fechado" | "abre" | "fecha",
    valor: boolean | string,
  ) {
    setHorarios((prev) => ({
      ...prev,
      [key]: { ...prev[key], [campo]: valor },
    }));
  }

  const inputClass =
    "w-full bg-charcoal border border-green/25 rounded-md px-3 py-2.5 text-bone outline-none focus:border-orange transition";

  if (loading) return <p className="text-bone-dim">Carregando...</p>;

  return (
    <div className="animate-rise">
      <span className="kicker mb-2">
        <span className="h-px w-6 bg-green-light" />
        Ajustes
      </span>
      <h1 className="font-display text-5xl text-bone mb-8">Configurações</h1>

      <form onSubmit={salvar} className="max-w-2xl space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-bone-dim">Link do Cardápio (Meep)</label>
            <input
              value={form.link_cardapio}
              onChange={(e) => setForm({ ...form, link_cardapio: e.target.value })}
              placeholder="https://mepay.meep.cloud/mulligans"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-bone-dim">Link do Sympla (produtor)</label>
            <input
              value={form.link_sympla}
              onChange={(e) => setForm({ ...form, link_sympla: e.target.value })}
              placeholder="https://www.sympla.com.br/produtor/mulliganspub"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-bone-dim">
            Texto &quot;Sobre&quot; (aparece na Home)
          </label>
          <textarea
            rows={3}
            value={form.texto_sobre}
            onChange={(e) => setForm({ ...form, texto_sobre: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-bone-dim">Endereço (curto)</label>
            <input
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              placeholder="Belo Horizonte — MG"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-bone-dim">Instagram</label>
            <input
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="@mulligans.bh"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-bone-dim">Endereço completo</label>
          <input
            value={form.endereco_completo}
            onChange={(e) => setForm({ ...form, endereco_completo: e.target.value })}
            placeholder="Rua Pium-Í, 229 - Cruzeiro, Belo Horizonte - MG, 30310-080"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-bone-dim">WhatsApp</label>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="5531995550660"
            className={inputClass}
          />
        </div>

        {/* ---------- Horário de funcionamento ---------- */}
        <div className="border-t border-green/20 pt-5">
          <h2 className="font-display text-2xl text-bone mb-1">Horário de Funcionamento</h2>
          <p className="text-sm text-bone-dim mb-4">
            Marque <strong className="text-bone">Fechado</strong> nos dias em que o pub não abre.
            Nos demais, informe o horário de abertura e fechamento.
          </p>

          <div className="space-y-2">
            {DIAS_SEMANA.map(({ key, label }) => {
              const dia = horarios[key];
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center gap-3 bg-charcoal/60 border border-green/15 rounded-md px-3 py-2.5"
                >
                  <span className="w-24 text-sm text-bone font-medium">{label}</span>

                  <label className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dia.fechado}
                      onChange={(e) => atualizarDia(key, "fechado", e.target.checked)}
                      className="w-4 h-4 accent-orange"
                    />
                    Fechado
                  </label>

                  {!dia.fechado && (
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="time"
                        value={dia.abre}
                        onChange={(e) => atualizarDia(key, "abre", e.target.value)}
                        className="bg-charcoal border border-green/25 rounded-md px-2 py-1.5 text-bone outline-none focus:border-orange transition"
                      />
                      <span className="text-bone-dim text-sm">às</span>
                      <input
                        type="time"
                        value={dia.fecha}
                        onChange={(e) => atualizarDia(key, "fecha", e.target.value)}
                        className="bg-charcoal border border-green/25 rounded-md px-2 py-1.5 text-bone outline-none focus:border-orange transition"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 bg-charcoal/40 border border-green/15 rounded-md px-3 py-2.5">
            <p className="text-xs uppercase tracking-[0.2em] text-green-light mb-1">
              Como aparece no site
            </p>
            <p className="text-sm text-bone-dim">{formatarHorarios(horarios)}</p>
          </div>
        </div>

        <div className="border-t border-green/20 pt-5">
          <h2 className="font-display text-2xl text-bone mb-4">Aniversário</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-bone-dim">Título da seção</label>
              <input
                value={form.aniversario_titulo}
                onChange={(e) => setForm({ ...form, aniversario_titulo: e.target.value })}
                placeholder="Seu Aniversário no Mulligan's"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-bone-dim">
                Condições (uma por linha)
              </label>
              <textarea
                rows={4}
                value={form.aniversario_condicoes}
                onChange={(e) => setForm({ ...form, aniversario_condicoes: e.target.value })}
                placeholder={
                  "Aniversariante não paga a entrada\nMesa reservada para grupos a partir de 6 pessoas\nGuardamos o seu bolo durante a festa (não fornecemos bolo)"
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-bone-dim">
                Voucher por número de pessoas (uma regra por linha)
              </label>
              <textarea
                rows={4}
                value={form.aniversario_voucher}
                onChange={(e) => setForm({ ...form, aniversario_voucher: e.target.value })}
                placeholder={
                  "De 6 a 9 pessoas: voucher de R$ 50 para consumir no bar\nDe 10 a 15 pessoas: voucher de R$ 100 para consumir no bar\nAcima de 15 pessoas: voucher de R$ 150 + mesa exclusiva"
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-green/20 pt-5">
          <h2 className="font-display text-2xl text-bone mb-4">Evento Privado</h2>
          <div>
            <label className="block text-sm mb-1 text-bone-dim">Texto de apresentação</label>
            <textarea
              rows={3}
              value={form.evento_privado_texto}
              onChange={(e) => setForm({ ...form, evento_privado_texto: e.target.value })}
              placeholder="Que tal reservar o Mulligan's só para o seu grupo?"
              className={inputClass}
            />
          </div>
        </div>

        {msg && <p className="text-sm text-green-light">{msg}</p>}
        {erro && <p className="text-sm text-orange-light">{erro}</p>}

        <button
          disabled={salvando}
          type="submit"
          className="btn-primary hover:btn-primary-hover disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {salvando ? "Salvando..." : "Salvar Configurações"}
        </button>
      </form>
    </div>
  );
}
