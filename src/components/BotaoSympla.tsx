"use client";

type Props = {
  /** ID do evento — usado para registrar o clique no banco. */
  eventoId: string;
  /** URL de destino no Sympla. */
  href: string;
  /** Texto do botão. */
  children?: React.ReactNode;
  /** Classes extras (o visual base já vem pronto). */
  className?: string;
};

/**
 * Botão de compra de ingresso que registra o clique antes de abrir o Sympla.
 * O contador é exibido apenas no painel admin.
 *
 * Histórico das tentativas (para não repetir os erros):
 *
 * 1) `supabase.rpc()` — falhava porque o link abre em nova aba
 *    (`target="_blank"`); ao descarregar a página, o navegador cancelava a
 *    requisição assíncrona pendente.
 *
 * 2) `navigator.sendBeacon()` direto no Supabase — funcionava no desktop, mas
 *    falhava no celular. Motivo: o `sendBeacon` NÃO permite headers
 *    customizados, então `apikey`/`Authorization` nunca eram enviados e o
 *    Supabase respondia 401. No mobile o beacon retornava `true` e o código
 *    saía antes do fallback.
 *
 * 3) `sendBeacon` com a apikey na query string — ainda falhava no 4G, pois
 *    alguns navegadores móveis/proxies descartam requisições cross-origin
 *    feitas no unload.
 *
 * Solução atual: o beacon aponta para a rota INTERNA `/api/clique`
 * (same-origin, sem CORS e sem headers). O servidor Next.js é quem chama a
 * RPC do Supabase com as credenciais corretas. Mantemos o `fetch` com
 * `keepalive` como fallback.
 */
export default function BotaoSympla({
  eventoId,
  href,
  children = "Comprar ingresso",
  className = "",
}: Props) {
  function registrarClique() {
    const endpoint = "/api/clique";
    const body = JSON.stringify({ evento_id: eventoId });

    // 1) Caminho preferencial: sendBeacon (sobrevive à troca de aba).
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const enviado = navigator.sendBeacon(endpoint, blob);
      if (enviado) return;
    }

    // 2) Fallback: fetch com keepalive (mesma garantia de entrega).
    try {
      void fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch {
      // Silencioso: o clique nunca deve impedir a abertura do Sympla.
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={registrarClique}
      className={className}
    >
      {children}
    </a>
  );
}
