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
 * Botão de compra de ingresso que registra o clique no Supabase antes de
 * abrir o Sympla. O contador é exibido apenas no painel admin.
 *
 * Histórico das tentativas (para não repetir os erros):
 *
 * 1) `supabase.rpc()` — falhava porque o link abre em nova aba
 *    (`target="_blank"`); ao descarregar a página, o navegador cancelava a
 *    requisição assíncrona pendente.
 *
 * 2) `navigator.sendBeacon()` com headers — funcionava no desktop, mas
 *    falhava no celular. Motivo: o `sendBeacon` NÃO permite headers
 *    customizados, então `apikey`/`Authorization` nunca eram enviados e o
 *    Supabase respondia 401. No mobile o beacon retornava `true` e o código
 *    saía antes do fallback.
 *
 * Solução atual: enviamos a chave do Supabase na QUERY STRING
 * (`?apikey=...`), que o PostgREST aceita como alternativa ao header. Assim
 * o `sendBeacon` funciona em qualquer dispositivo, sem depender de headers.
 * Mantemos o `fetch` com `keepalive` como fallback.
 */
export default function BotaoSympla({
  eventoId,
  href,
  children = "Comprar ingresso",
  className = "",
}: Props) {
  function registrarClique() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    // A chave vai na query string: o sendBeacon não suporta headers.
    const endpoint =
      `${url}/rest/v1/rpc/incrementar_clique_sympla` +
      `?apikey=${encodeURIComponent(key)}`;
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
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
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
