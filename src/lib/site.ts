/**
 * Constantes globais do site — links, contatos e textos padrão.
 * Valores vindos do banco (tabela `configuracoes`) têm prioridade;
 * estes são os fallbacks.
 */

export const SITE = {
  nome: "The Mulligan's Pub",
  tagline: "Purveyor of Good Moments",
  desde: 2020,
  cidade: "Belo Horizonte — MG",

  /** Frase de posicionamento — usada no Hero e em metadados. */
  descricao:
    "Um autêntico pub irlandês no coração de Belo Horizonte: cerveja gelada, comida de verdade e música ao vivo.",
  /** Versão curta para selos e etiquetas. */
  selo: "Autêntico Pub Irlandês",

  cardapio: "https://mepay.meep.cloud/mulligans",
  sympla: "https://www.sympla.com.br/produtor/mulliganspub",
  instagram: "https://instagram.com/mulligans.bh",
  instagramHandle: "mulligans.bh",
  whatsapp:
    "https://api.whatsapp.com/send/?phone=5531995550660&text&type=phone_number&app_absent=0",
  whatsappNumero: "5531995550660",

  endereco: "Rua Pium-Í, 229 - Cruzeiro, Belo Horizonte - MG, 30310-080",
} as const;

/** Link do Google Maps para o endereço do pub. */
export function mapsLink(endereco: string = SITE.endereco) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

/* ============================================================
   HORÁRIO DE FUNCIONAMENTO ESTRUTURADO
   ============================================================
   O admin edita uma grade por dia da semana. Guardamos um objeto
   `Horarios` (jsonb no Supabase) e geramos o texto legível a partir
   dele. O campo antigo `horario_funcionamento` continua como
   fallback para bancos que ainda não migraram.
   ============================================================ */

/** Chaves dos dias da semana, na ordem de exibição (Segunda → Domingo). */
export const DIAS_SEMANA = [
  { key: "seg", label: "Segunda", curto: "Seg" },
  { key: "ter", label: "Terça", curto: "Ter" },
  { key: "qua", label: "Quarta", curto: "Qua" },
  { key: "qui", label: "Quinta", curto: "Qui" },
  { key: "sex", label: "Sexta", curto: "Sex" },
  { key: "sab", label: "Sábado", curto: "Sáb" },
  { key: "dom", label: "Domingo", curto: "Dom" },
] as const;

export type DiaKey = (typeof DIAS_SEMANA)[number]["key"];

/** Horário de um único dia. `fechado` tem prioridade sobre abertura/fechamento. */
export type HorarioDia = {
  fechado: boolean;
  abre: string; // "18:00"
  fecha: string; // "00:00"
};

/** Mapa de todos os dias da semana. */
export type Horarios = Record<DiaKey, HorarioDia>;

/** Grade padrão (usada quando o banco ainda não tem horários salvos). */
export const HORARIOS_PADRAO: Horarios = {
  seg: { fechado: true, abre: "18:00", fecha: "23:00" },
  ter: { fechado: true, abre: "18:00", fecha: "23:00" },
  qua: { fechado: false, abre: "18:00", fecha: "23:00" },
  qui: { fechado: false, abre: "18:00", fecha: "23:00" },
  sex: { fechado: false, abre: "18:00", fecha: "02:00" },
  sab: { fechado: false, abre: "18:00", fecha: "02:00" },
  dom: { fechado: false, abre: "16:00", fecha: "23:00" },
};

/** Normaliza um valor vindo do banco para um objeto `Horarios` válido. */
export function normalizarHorarios(valor: unknown): Horarios {
  const base: Horarios = { ...HORARIOS_PADRAO };
  if (!valor || typeof valor !== "object") return base;
  const obj = valor as Record<string, unknown>;
  for (const { key } of DIAS_SEMANA) {
    const dia = obj[key];
    if (dia && typeof dia === "object") {
      const d = dia as Record<string, unknown>;
      base[key] = {
        fechado: Boolean(d.fechado),
        abre: typeof d.abre === "string" && d.abre ? d.abre : base[key].abre,
        fecha: typeof d.fecha === "string" && d.fecha ? d.fecha : base[key].fecha,
      };
    }
  }
  return base;
}

/** Formata "18:00" → "18h" e "18:30" → "18h30". */
function formatarHora(hora: string): string {
  const [h, m] = hora.split(":");
  const horaNum = String(Number(h));
  return m && m !== "00" ? `${horaNum}h${m}` : `${horaNum}h`;
}

/**
 * Gera o texto legível a partir da grade de horários, agrupando dias
 * consecutivos com o mesmo horário.
 * Ex.: "Qua e Qui: 18h–23h · Sex e Sáb: 18h–02h · Dom: 16h–23h"
 */
export function formatarHorarios(horarios: Horarios): string {
  type Grupo = { dias: string[]; texto: string };
  const grupos: Grupo[] = [];

  for (const { key, curto } of DIAS_SEMANA) {
    const dia = horarios[key];
    const texto = dia.fechado ? "Fechado" : `${formatarHora(dia.abre)}–${formatarHora(dia.fecha)}`;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.texto === texto) {
      ultimo.dias.push(curto);
    } else {
      grupos.push({ dias: [curto], texto });
    }
  }

  return grupos
    .map(({ dias, texto }) => {
      const rotulo =
        dias.length === 1
          ? dias[0]
          : dias.length === 2
            ? `${dias[0]} e ${dias[1]}`
            : `${dias[0]} a ${dias[dias.length - 1]}`;
      return `${rotulo}: ${texto}`;
    })
    .join(" · ");
}

/**
 * Resolve o texto de horário a exibir: usa a grade estruturada se houver
 * algum dia aberto; caso contrário, cai no texto livre antigo.
 */
export function textoHorario(
  horarios: unknown,
  fallback?: string | null,
): string | null {
  const normalizado = normalizarHorarios(horarios);
  const temAlgumAberto = DIAS_SEMANA.some(({ key }) => !normalizado[key].fechado);
  if (temAlgumAberto) return formatarHorarios(normalizado);
  return fallback?.trim() ? fallback : null;
}

/** Monta um link de WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(mensagem?: string) {
  const base = `https://api.whatsapp.com/send/?phone=${SITE.whatsappNumero}&type=phone_number&app_absent=0`;
  return mensagem ? `${base}&text=${encodeURIComponent(mensagem)}` : base;
}

/** Condições padrão da promoção de aniversário (editáveis no painel). */
export const ANIVERSARIO_PADRAO = [
  {
    titulo: "Aniversariante não paga",
    descricao: "Entrada gratuita para o aniversariante e mais um acompanhante.",
    icone: "🎂",
  },
  {
    titulo: "Mesa reservada",
    descricao: "Reserva de mesa garantida para grupos a partir de 6 pessoas.",
    icone: "🍻",
  },
  {
    titulo: "Guardamos o seu bolo",
    descricao: "Traga o seu bolo — nós guardamos e conservamos durante toda a festa.",
    icone: "🎉",
  },
] as const;

/**
 * Regra de voucher por número de pessoas (editável no painel).
 * Cada linha vira um item da lista na seção de aniversário.
 */
export const ANIVERSARIO_VOUCHER_PADRAO = [
  "De 6 a 9 pessoas: voucher de R$ 50 para consumir no bar",
  "De 10 a 15 pessoas: voucher de R$ 100 para consumir no bar",
  "Acima de 15 pessoas: voucher de R$ 150 + mesa exclusiva",
] as const;

/** Ocasiões atendidas para eventos privados. */
export const EVENTO_PRIVADO_OCASIOES = [
  { titulo: "Aniversários", icone: "🎂" },
  { titulo: "Confraternizações", icone: "🥂" },
  { titulo: "Eventos corporativos", icone: "💼" },
  { titulo: "Comemorações", icone: "🎊" },
] as const;

/** O que está incluso no evento privado. */
export const EVENTO_PRIVADO_INCLUSO = [
  "Espaço exclusivo para o seu grupo",
  "Estrutura de som e palco",
  "Bar completo com drinks e chopes",
  "Cozinha aberta com cardápio personalizável",
  "Equipe dedicada ao atendimento",
  "Flexibilidade de horário",
] as const;
