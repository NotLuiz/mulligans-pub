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
