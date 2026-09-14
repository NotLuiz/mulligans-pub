"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import { WhatsappIcon } from "@/components/SocialIcons";

const OCASIOES = [
  "Aniversário",
  "Confraternização",
  "Evento corporativo",
  "Comemoração",
  "Outro",
];

export default function EventoPrivadoForm() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [pessoas, setPessoas] = useState("");
  const [ocasiao, setOcasiao] = useState(OCASIOES[0]);
  const [mensagem, setMensagem] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();

    const texto = [
      "Olá! Gostaria de solicitar um orçamento para um evento privado no Mulligan's Pub.",
      "",
      `*Nome:* ${nome}`,
      telefone ? `*Telefone:* ${telefone}` : null,
      data ? `*Data desejada:* ${data}` : null,
      pessoas ? `*Nº de pessoas:* ${pessoas}` : null,
      `*Ocasião:* ${ocasiao}`,
      mensagem ? `*Detalhes:* ${mensagem}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(texto), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full bg-ink border border-green/25 rounded-lg px-4 py-3 text-bone placeholder:text-bone-dim/50 focus:outline-none focus:border-orange transition";

  return (
    <form onSubmit={enviar} className="card-rustic p-6 md:p-8 space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-bone-dim mb-2">Seu nome *</label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como podemos te chamar?"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-bone-dim mb-2">Telefone / WhatsApp</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(31) 9 9999-9999"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-bone-dim mb-2">Data desejada</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-bone-dim mb-2">Número de pessoas</label>
          <input
            type="number"
            min={1}
            value={pessoas}
            onChange={(e) => setPessoas(e.target.value)}
            placeholder="Ex.: 30"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-bone-dim mb-2">Ocasião</label>
        <select
          value={ocasiao}
          onChange={(e) => setOcasiao(e.target.value)}
          className={inputClass}
        >
          {OCASIOES.map((o) => (
            <option key={o} value={o} className="bg-ink">
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-bone-dim mb-2">Detalhes do evento</label>
        <textarea
          rows={4}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Conte um pouco sobre o que você imagina para o seu evento..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button type="submit" className="btn-primary hover:btn-primary-hover w-full">
        <WhatsappIcon className="w-5 h-5" />
        Enviar pelo WhatsApp
      </button>

      <p className="text-bone-dim/60 text-xs text-center">
        Ao enviar, você será redirecionado para o WhatsApp com a mensagem já preenchida.
      </p>
    </form>
  );
}
