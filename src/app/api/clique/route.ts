import { NextResponse } from "next/server";

/**
 * Registra o clique no botão do Sympla.
 *
 * Por que existe esta rota?
 * O `navigator.sendBeacon()` é a única forma confiável de enviar dados quando
 * o usuário abre um link em nova aba (o navegador cancela requisições normais
 * ao descarregar a página). Porém o `sendBeacon` NÃO permite headers
 * customizados — e o Supabase exige `apikey`/`Authorization`. No celular
 * (4G) isso resultava em 401 silencioso.
 *
 * Solução: o beacon aponta para esta rota do PRÓPRIO site (same-origin, sem
 * CORS e sem headers). Aqui, no servidor, chamamos a RPC do Supabase com as
 * credenciais corretas.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { evento_id?: string };
    const eventoId = body?.evento_id;

    if (!eventoId || typeof eventoId !== "string") {
      return NextResponse.json({ ok: false, erro: "evento_id ausente" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ ok: false, erro: "Supabase não configurado" }, { status: 500 });
    }

    const resposta = await fetch(`${url}/rest/v1/rpc/incrementar_clique_sympla`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ evento_id: eventoId }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      return NextResponse.json(
        { ok: false, erro: "Falha ao registrar clique", detalhe },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, erro: "Requisição inválida" }, { status: 400 });
  }
}
