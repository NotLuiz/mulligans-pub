"use client";
import { supabase } from "@/lib/supabase";

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
 * O clique é registrado de forma "fire-and-forget": não bloqueia a abertura
 * do link nem mostra erro ao visitante caso a RPC falhe.
 */
export default function BotaoSympla({
  eventoId,
  href,
  children = "Comprar ingresso",
  className = "",
}: Props) {
  function registrarClique() {
    // Não aguardamos a resposta: o link abre imediatamente.
    void supabase.rpc("incrementar_clique_sympla", { evento_id: eventoId });
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
