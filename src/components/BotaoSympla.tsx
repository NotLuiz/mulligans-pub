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
 * Por que não usamos o client do Supabase aqui:
 * O link abre em nova aba (`target="_blank"`). Quando isso acontece, o
 * navegador descarrega a página atual e CANCELA requisições assíncronas
 * pendentes — a chamada `supabase.rpc()` era abortada antes de chegar ao
 * servidor, por isso o contador nunca subia.
 *
 * Solução: `navigator.sendBeacon()`, uma API feita exatamente para enviar
 * dados que precisam sobreviver à navegação/descarga da página. Ela é
 * enfileirada pelo navegador e enviada mesmo que a aba seja fechada ou
 * trocada. Como fallback (navegadores antigos), usamos `fetch` com
 * `keepalive: true`, que tem o mesmo efeito.
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

    const endpoint = `${url}/rest/v1/rpc/incrementar_clique_sympla`;
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
