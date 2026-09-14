# 🍻 The Mulligan's Pub — Site Oficial

Site oficial do **The Mulligan's Pub**, pub localizado em Belo Horizonte (MG).
Reúne programação de eventos com calendário interativo, galeria de fotos e
painel administrativo didático para funcionários atualizarem o conteúdo.

> **Purveyor of Good Moments — desde 2020**

---

## 🎯 A Ideia

Criar um site simples, bonito e fácil de manter que:

- Mostre para o público a **programação de eventos** do pub (com calendário interativo).
- Redirecione os clientes direto para a **compra de ingressos no Sympla**.
- Leve ao **cardápio online (Meep)** com um clique.
- Exiba uma **galeria de fotos** (o pub, shows, comida, drinks).
- Tenha um **painel de administração** tão simples que qualquer funcionário
  consiga usar sem treinamento técnico.

Sem login para o público. Sem sistema de pagamento no site (isso fica no Sympla).
Sem complexidade — porque a ideia é durar anos sem manutenção pesada.

---

## 🧱 Stack Utilizada

| Camada     | Tecnologia                                | Por quê                                             |
| ---------- | ----------------------------------------- | --------------------------------------------------- |
| Frontend   | **Next.js 15** (App Router) + **React**   | Rápido, ótimo SEO, componentes reutilizáveis        |
| Estilo     | **Tailwind CSS**                          | Layout moderno com pouco código                     |
| Fonte      | **Inter** + **Pirata One** (Google Fonts) | San-serif limpa + fonte gótica temática             |
| Backend/DB | **Supabase** (Postgres + Auth + Storage)  | Banco, login e imagens num só lugar, plano gratuito |
| Datas      | **date-fns** (pt-BR)                      | Formatação de datas em português                    |
| Hospedagem | Vercel (frontend) + Supabase (backend)    | Planos gratuitos que cobrem o pub com folga         |

---

## 📁 Estrutura do Projeto

```
mulligans-pub/
├── public/                  # Imagens fixas (logo, hero, fotos de destaque)
│   ├── logo.png
│   ├── hero.jpg
│   ├── banda.jpg
│   ├── burger.jpg
│   ├── telefone.jpg
│   └── drinks.jpg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout global (fonte, navbar, footer)
│   │   ├── page.tsx                 # Home pública
│   │   ├── globals.css              # Estilos globais + scrollbar custom
│   │   │
│   │   ├── eventos/page.tsx         # Calendário + lista de eventos
│   │   ├── galeria/page.tsx         # Grid de fotos
│   │   │
│   │   └── admin/
│   │       ├── login/page.tsx       # Tela de login
│   │       └── (painel)/            # Rotas protegidas (só logado)
│   │           ├── layout.tsx       # Sidebar + verificação de sessão
│   │           ├── page.tsx         # Dashboard com cards
│   │           ├── eventos/
│   │           │   ├── page.tsx     # Lista de eventos
│   │           │   ├── novo/page.tsx
│   │           │   └── [id]/page.tsx
│   │           ├── galeria/page.tsx
│   │           └── configuracoes/page.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx               # Menu superior (logo + links + cardápio)
│   │   ├── Footer.tsx               # Rodapé com contato e links
│   │   ├── Calendar.tsx             # Calendário interativo de eventos
│   │   └── admin/
│   │       └── EventoForm.tsx       # Formulário reutilizável (criar/editar)
│   │
│   └── lib/
│       └── supabase.ts              # Cliente Supabase configurado
│
├── .env.local                       # Chaves do Supabase (NÃO versionar!)
├── next.config.ts                   # Libera domínios de imagem (Supabase, Unsplash)
├── package.json
└── README.md                        # Este arquivo
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabela `eventos`

Guarda os shows e eventos cadastrados pelo admin.

| Campo         | Tipo        | Descrição                             |
| ------------- | ----------- | ------------------------------------- |
| `id`          | uuid        | Chave primária gerada automaticamente |
| `titulo`      | text        | Nome do evento                        |
| `descricao`   | text        | Descrição curta                       |
| `data`        | timestamptz | Data e hora do evento                 |
| `local`       | text        | Padrão: "The Mulligan's Pub"          |
| `imagem_url`  | text        | URL do flyer no Supabase Storage      |
| `link_sympla` | text        | Link direto para compra               |
| `publicado`   | boolean     | Se `false`, fica como rascunho        |
| `created_at`  | timestamptz | Data de criação                       |

### Tabela `galeria`

Fotos do pub organizadas por categoria (`geral`, `shows`, `comida`, `o-pub`).

### Tabela `configuracoes`

Uma única linha (`id = 1`) com dados editáveis pelo painel:

| Campo                   | Descrição                                                     |
| ----------------------- | ------------------------------------------------------------- |
| `link_cardapio`         | Link do cardápio (Meep)                                       |
| `link_sympla`           | Página do produtor no Sympla                                  |
| `texto_sobre`           | Texto "sobre" exibido na Home                                 |
| `endereco`              | Endereço curto (ex.: "Belo Horizonte — MG")                   |
| `endereco_completo`     | Endereço completo com CEP (usado no rodapé, com link do Maps) |
| `horario_funcionamento` | Horário exibido no rodapé e no CTA final                      |
| `instagram`             | Handle do Instagram (ex.: `@mulligans.bh`)                    |
| `whatsapp`              | Número do WhatsApp                                            |
| `aniversario_titulo`    | Título da seção de aniversário                                |
| `aniversario_condicoes` | Condições (uma por linha)                                     |
| `aniversario_voucher`   | Regras de voucher por nº de pessoas (uma por linha)           |
| `evento_privado_texto`  | Texto de apresentação do evento privado                       |

> **Migração:** se o banco foi criado antes destes campos, rode o script
> [`plans/migracao-configuracoes.sql`](plans/migracao-configuracoes.sql) no
> **Supabase → SQL Editor**. Ele é idempotente (`add column if not exists`).

### Buckets de Storage

- **`flyers`** → imagens dos eventos (público)
- **`galeria`** → fotos da galeria (público)

### Segurança (RLS)

- **Leitura:** aberta ao público (só eventos publicados).
- **Escrita:** apenas usuários autenticados (funcionários do pub).

---

## 🖥️ O que o Público Vê

### Home (`/`)

- **Hero** com foto da parede de tijolos + logo redondo + botões "Ver Programação" e "Cardápio".
- **Próximos Eventos** — os 3 próximos, com flyer e botão "Comprar ingresso" (Sympla).
- **A Casa** — mosaico com fotos (banda, cabine, burger, drinks, letreiro).
- **Últimos Momentos** — prévia da galeria (aparece depois que o admin subir fotos).

### Eventos (`/eventos`)

- **Calendário interativo** (navega entre meses, marca dias com eventos).
- Clicando num dia → mostra os eventos daquele dia + botão do Sympla.
- **Lista lateral** com todos os próximos shows.

### Galeria (`/galeria`)

- Grid responsivo com todas as fotos que o admin subir.
- Diferentes tamanhos para celular, tablet e desktop.

---

## 🔐 Painel Administrativo (`/admin`)

Login com **e-mail e senha** cadastrados no Supabase. Depois de logado, o
funcionário tem acesso a:

### 📊 Dashboard

Cards grandes com atalhos:

- **🎸 Eventos** — adicionar, editar, excluir
- **📸 Galeria** — subir várias fotos de uma vez
- **⚙️ Configurações** — editar link do cardápio, endereço, Instagram etc.

### 🎸 Eventos

- **Novo Evento:** título, data/hora (calendário nativo), local, descrição,
  link do Sympla, **upload de flyer** e opção de **rascunho** (não aparece no site).
- **Editar:** mesmo formulário com dados pré-preenchidos.
- **Excluir:** com confirmação.

### 📸 Galeria

- Seleciona **várias fotos de uma vez** → upload com barra de progresso.
- Categoria (Geral, Shows, Comida, O Pub).
- Passa o mouse na foto → botão **X** para excluir.

### ⚙️ Configurações

- Link do cardápio (Meep) — usado no Navbar, Home e Rodapé.
- Texto "sobre" da Home.
- Endereço, horário, Instagram, WhatsApp.

---

## 🎨 Identidade Visual

- **Cores:** fundo preto/cinza escuro (#0a0a0a), destaques em vermelho (#dc2626),
  textos em branco/cinza claro.
- **Fontes:**
  - **Pirata One** (títulos) → mantém o estilo gótico do logo.
  - **Inter** (corpo) → leitura limpa.
- **Elementos:** bordas rústicas, imagens em preto e branco com hover colorido,
  vermelho neon como cor de ação.

---

## 🛠️ Como Rodar Localmente

### 1. Pré-requisitos

- **Node.js 18+** instalado
- Conta no **Supabase** (gratuita)

### 2. Clonar e instalar

```bash
git clone <url-do-repo>
cd mulligans-pub
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

> ⚠️ **Importante:** a `NEXT_PUBLIC_SUPABASE_URL` deve ser a **URL base** do
> projeto, **sem** o sufixo `/rest/v1/`. O cliente do Supabase adiciona os
> caminhos `/rest/v1/` (dados) e `/auth/v1/` (login) automaticamente. Se você
> incluir `/rest/v1/`, o **login do painel admin falha**.

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deploy Gratuito (Passo a Passo)

O site usa dois serviços gratuitos: **Supabase** (banco de dados, login e
armazenamento de imagens) e **Vercel** (hospedagem do site). Ambos têm plano
gratuito que cobre com folga o uso de um pub.

### Parte 1 — Supabase (banco de dados + login + imagens)

> Se você já tem o projeto Supabase funcionando localmente, pule para a
> **Parte 2**. Só é preciso refazer isto se for criar um projeto novo.

1. **Criar o projeto**
   - Acesse [supabase.com](https://supabase.com) → **New project**.
   - Escolha um nome (ex.: `mulligans-pub`), uma senha forte para o banco e a
     região **South America (São Paulo)** para menor latência.
   - Aguarde ~2 minutos até o projeto ficar pronto.

2. **Criar as tabelas**
   - No menu lateral, abra **SQL Editor** → **New query**.
   - Cole e execute o SQL de criação das tabelas `eventos`, `galeria` e
     `configuracoes` (veja a seção [Banco de Dados](#-banco-de-dados-supabase)).
   - Depois execute também o arquivo [`plans/migracao-configuracoes.sql`](plans/migracao-configuracoes.sql)
     para adicionar as colunas novas (endereço, horários, aniversário, voucher).

3. **Criar os buckets de imagens**
   - Menu lateral → **Storage** → **New bucket**.
   - Crie dois buckets, ambos **públicos**:
     - `flyers` — imagens dos eventos
     - `galeria` — fotos da galeria
   - Em cada bucket, adicione uma policy de **upload/delete** para usuários
     autenticados e **leitura pública** (veja [Segurança (RLS)](#segurança-rls)).

4. **Criar o usuário do painel admin**
   - Menu lateral → **Authentication** → **Users** → **Add user** →
     **Create new user**.
   - Informe o **e-mail** e a **senha** que o funcionário usará em
     `/admin/login`.
   - Marque **Auto Confirm User** para não precisar confirmar por e-mail.
   - ⚠️ Não é preciso cadastro público: o site não tem tela de "criar conta".

5. **Copiar as credenciais**
   - Menu lateral → **Project Settings** → **API**.
   - Copie:
     - **Project URL** → ex.: `https://xxxxxxxx.supabase.co`
     - **anon public** key → a chave pública.
   - ⚠️ A URL deve ser a **base**, **sem** `/rest/v1/` no final.

### Parte 2 — Vercel (hospedagem do site)

1. **Subir o código para o GitHub**

   ```bash
   git init
   git add .
   git commit -m "Site The Mulligan's Pub"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/mulligans-pub.git
   git push -u origin main
   ```

   > O arquivo `.env.local` **não** vai para o GitHub (está no `.gitignore`).
   > As credenciais são configuradas direto na Vercel no passo 3.

2. **Importar na Vercel**
   - Acesse [vercel.com](https://vercel.com) → faça login **com o GitHub**.
   - Clique em **Add New…** → **Project** → selecione o repositório
     `mulligans-pub` → **Import**.
   - A Vercel detecta o Next.js automaticamente. **Não** altere o Build Command
     nem o Output Directory.

3. **Configurar as variáveis de ambiente**
   - Antes de clicar em Deploy, abra **Environment Variables** e adicione:
     | Nome | Valor |
     |------|-------|
     | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` (sem `/rest/v1/`) |
     | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave **anon public** do Supabase |
   - Marque os três ambientes (Production, Preview, Development).

4. **Deploy**
   - Clique em **Deploy** e aguarde ~1 minuto.
   - A Vercel gera uma URL tipo `https://mulligans-pub.vercel.app`.
   - A cada `git push` na branch `main`, o site é atualizado automaticamente.

5. **Domínio próprio (opcional, gratuito)**
   - No projeto da Vercel → **Settings** → **Domains** → **Add**.
   - Digite o domínio (ex.: `themulliganspub.com.br`) e siga as instruções de
     DNS. A Vercel emite o certificado HTTPS automaticamente.

### Parte 3 — Verificação pós-deploy

1. Abra a URL da Vercel e confira a Home, Eventos e Galeria.
2. Acesse `/admin`, faça login com o usuário criado no Supabase (Parte 1, passo 4).
3. Cadastre um evento de teste e envie uma foto para confirmar que o upload
   funciona em produção.
4. Se o **login falhar**, verifique se a `NEXT_PUBLIC_SUPABASE_URL` na Vercel
   **não** tem `/rest/v1/` no final e faça um **Redeploy**.

> 💡 **Custo:** R$ 0,00. Os planos gratuitos do Supabase (500 MB de banco,
> 1 GB de storage) e da Vercel (100 GB de banda/mês) são mais que suficientes
> para o site de um pub.

---

## 🍻 Como Atualizar o Site (Funcionário)

1. Acessar **`seusite.com/admin`**
2. Fazer login com o e-mail e senha fornecidos.
3. Escolher o que atualizar:
   - **Novo show?** → Eventos → + Novo Evento → preencher → Salvar.
   - **Fotos novas da festa?** → Galeria → selecionar fotos → aguardar upload.
   - **Mudou o link do cardápio?** → Configurações → editar → Salvar.
4. Pronto! Aparece no site em até **1 minuto** (cache automático).

---

## 📝 Notas Técnicas

- **Cache:** as páginas públicas usam `revalidate = 60` (atualizam a cada 60s).
- **Imagens:** otimizadas automaticamente pelo componente `<Image>` do Next.
- **Rotas protegidas:** o `layout.tsx` do `(painel)` verifica a sessão do Supabase
  e redireciona para `/admin/login` se não estiver logado.
- **A pasta `(painel)`** com parênteses é um "grupo de rotas" do Next.js — serve
  para compartilhar o layout sem aparecer na URL.

---

## ✅ Changelog

### v1.0 — Versão inicial

- ✅ Home com hero, próximos eventos e galeria
- ✅ Página de eventos com calendário interativo
- ✅ Página de galeria
- ✅ Login administrativo
- ✅ CRUD de eventos (criar, editar, excluir)
- ✅ Upload de fotos para a galeria
- ✅ Edição de configurações (cardápio, textos, contato)
- ✅ Layout responsivo (mobile e desktop)
- ✅ Identidade visual alinhada com o pub

---

**Feito com 🍺 e ☕ em Belo Horizonte.**
