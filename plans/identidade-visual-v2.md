# Plano — Identidade Visual v2 + Novas Seções

## 1. Nova Paleta (verde, laranja, branco, preto — tons escuros)

Substituir a paleta atual (preto + latão + neon vermelho) por uma paleta
"pub irlandês moderno": verde profundo como cor institucional, laranja como
cor de ação/destaque, branco osso para texto e preto esverdeado para fundos.

| Token                    | Hex       | Uso                                |
| ------------------------ | --------- | ---------------------------------- |
| `--color-ink`            | `#0b0f0d` | Fundo principal (preto esverdeado) |
| `--color-ink-soft`       | `#111714` | Fundo de seções alternadas         |
| `--color-charcoal`       | `#18211c` | Cartões e inputs                   |
| `--color-charcoal-light` | `#22302a` | Hover de cartões                   |
| `--color-bone`           | `#f4f7f4` | Texto principal (branco osso)      |
| `--color-bone-dim`       | `#a9b5ad` | Texto secundário                   |
| `--color-green`          | `#1f7a4d` | Verde institucional                |
| `--color-green-light`    | `#2fa86a` | Verde claro / hover                |
| `--color-green-dark`     | `#145034` | Verde profundo                     |
| `--color-orange`         | `#f97316` | Laranja de ação (CTA)              |
| `--color-orange-light`   | `#fb923c` | Hover do laranja                   |
| `--color-orange-dark`    | `#c2410c` | Laranja profundo                   |

- Renomear utilitários: `btn-neon` → `btn-primary` (laranja),
  `text-neon-glow` → `text-orange-glow`, `border-brass` → `border-green`.
- Manter `card-rustic`, `kicker`, `photo-bw`, `divider-ornament` com as novas cores.
- Atualizar `flicker` para brilho laranja.

## 2. Mapa de Logos

| Local                     | Arquivo              | Justificativa                        |
| ------------------------- | -------------------- | ------------------------------------ |
| Navbar                    | `logo.png`           | Logo principal, já circular          |
| Hero (Home)               | `logo.png`           | Destaque grande                      |
| Footer                    | `logo.png`           | Consistência                         |
| Favicon / Apple icon      | `LETRA M EM PNG.png` | Monograma legível em tamanho pequeno |
| Marca d'água / divisor    | `LETRA M EM PNG.png` | Uso decorativo                       |
| Fundos claros (se houver) | `03- LOGO PRETA.png` | Reserva                              |
| `02- LOGO PNG.png`        | Não usar             | Duplicata da principal               |

## 3. Links e Contatos Reais

Centralizar em `src/lib/site.ts`:

```
cardapio:  https://mepay.meep.cloud/mulligans
sympla:    https://www.sympla.com.br/produtor/mulliganspub
instagram: https://instagram.com/mulligans.bh
whatsapp:  https://api.whatsapp.com/send/?phone=5531995550660
endereco:  (placeholder editável no painel — preencher depois)
```

## 4. Novas Seções

### 4.1 Aniversário (condições)

Seção na Home com 3 cards de condições (sugestão inicial, editável):

- **Aniversariante não paga** — entrada gratuita para o aniversariante + 1 acompanhante.
- **Mesa reservada** — reserva de mesa para grupos a partir de 6 pessoas.
- **Bolo na casa** — o pub oferece o bolo; traga apenas a decoração.
- CTA: "Reservar pelo WhatsApp".

### 4.2 Evento Privado

Nova página `/evento-privado` com:

- Hero explicativo (alugue o pub para seu evento).
- Cards de ocasiões: aniversários, confraternizações, corporativo, casamentos.
- Lista do que está incluso (som, palco, bar, cozinha, equipe).
- Formulário simples (nome, data, nº de pessoas, mensagem) que monta
  uma mensagem e abre o WhatsApp já preenchida — sem backend.
- CTA principal: WhatsApp.

## 5. Componentes Novos

- `src/lib/site.ts` — constantes de links/contatos.
- `src/components/SocialIcons.tsx` — ícones SVG inline (Instagram, WhatsApp,
  Sympla, Cardápio) reutilizáveis no Navbar, Footer e CTAs.
- `src/components/Aniversario.tsx` — seção de condições.
- `src/components/EventoPrivadoForm.tsx` — formulário que gera link do WhatsApp.

## 6. Banco de Dados (Supabase)

Adicionar colunas em `configuracoes` (via SQL no painel Supabase):

- `endereco_completo` (text)
- `link_sympla` (text)
- `aniversario_titulo` (text)
- `aniversario_condicoes` (text) — uma condição por linha
- `evento_privado_texto` (text)

O painel admin passa a editar esses campos. Enquanto não existirem, o código
usa fallback com os valores padrão.

## 7. Correções Técnicas

- Adicionar `sizes` em todas as imagens com `fill`.
- Adicionar `width: auto` / `height: auto` onde a proporção é alterada.
- `loading="eager"` no hero (LCP).

## 8. Ordem de Execução

1. `globals.css` — nova paleta e utilitários.
2. `src/lib/site.ts` — constantes.
3. `SocialIcons.tsx` — ícones.
4. Navbar, Footer.
5. Home (paleta + Aniversário + Evento Privado).
6. Página `/evento-privado` + formulário.
7. Eventos, Galeria.
8. Admin (login, layout, dashboard, formulários, configurações).
9. Correções de `next/image`.
10. Build + `npm run dev`.
