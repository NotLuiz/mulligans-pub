import { NextResponse } from "next/server";

/**
 * Extrai os metadados Open Graph de uma página do Sympla.
 *
 * O Sympla não oferece API pública de leitura para eventos, mas expõe as
 * tags `og:title`, `og:description`, `og:image` e `twitter:description`
 * (esta última costuma conter a descrição completa do evento).
 *
 * Uso: GET /api/sympla?url=https://www.sympla.com.br/evento/...
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

function decodificarEntidades(texto: string): string {
  return texto
    .replace(/"/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/'/g, "'")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function extrairMeta(html: string, propriedade: string): string | null {
  // Aceita tanto property="og:x" quanto name="og:x", em qualquer ordem.
  const padroes = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${propriedade}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${propriedade}["']`,
      "i",
    ),
  ];
  for (const re of padroes) {
    const m = html.match(re);
    if (m?.[1]) return decodificarEntidades(m[1]).trim();
  }
  return null;
}

function limparDescricao(texto: string | null): string {
  if (!texto) return "";
  return texto
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const alvo = searchParams.get("url");

  if (!alvo) {
    return NextResponse.json({ ok: false, erro: "Parâmetro 'url' ausente" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(alvo);
  } catch {
    return NextResponse.json({ ok: false, erro: "URL inválida" }, { status: 400 });
  }

  if (!/(^|\.)sympla\.com\.br$/i.test(parsed.hostname)) {
    return NextResponse.json(
      { ok: false, erro: "Apenas links do sympla.com.br são aceitos" },
      { status: 400 },
    );
  }

  try {
    const resposta = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
      cache: "no-store",
      redirect: "follow",
    });

    if (!resposta.ok) {
      return NextResponse.json(
        { ok: false, erro: `Sympla respondeu ${resposta.status}` },
        { status: 502 },
      );
    }

    const html = await resposta.text();

    const titulo = extrairMeta(html, "og:title");
    const descricao =
      limparDescricao(extrairMeta(html, "twitter:description")) ||
      limparDescricao(extrairMeta(html, "og:description"));
    const imagem = extrairMeta(html, "og:image");

    if (!titulo && !descricao && !imagem) {
      return NextResponse.json(
        { ok: false, erro: "Não encontrei dados do evento nesse link" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, titulo, descricao, imagem });
  } catch {
    return NextResponse.json({ ok: false, erro: "Falha ao acessar o Sympla" }, { status: 502 });
  }
}
