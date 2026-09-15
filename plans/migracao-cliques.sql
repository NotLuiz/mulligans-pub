-- ============================================================
-- MIGRAÇÃO — Contador de cliques no botão Sympla
-- The Mulligan's Pub
-- ============================================================
-- Execute este script no Supabase → SQL Editor.
-- É idempotente: pode ser rodado mais de uma vez sem erro.
--
-- O que faz:
--   1. Adiciona a coluna `cliques_sympla` (integer) na tabela `eventos`.
--   2. Cria a função RPC `incrementar_clique_sympla(uuid)` que soma +1
--      de forma atômica e segura (security definer), permitindo que o
--      site público registre o clique sem expor UPDATE livre na tabela.
--
-- Evolução futura: para histórico por data, basta criar uma tabela
-- `cliques` (evento_id, created_at) e trocar o corpo da função para
-- inserir uma linha em vez de incrementar a coluna.
-- ============================================================

alter table eventos
  add column if not exists cliques_sympla integer not null default 0;

-- ------------------------------------------------------------
-- Função RPC — incrementa o contador de um evento.
-- SECURITY DEFINER: roda com privilégios do dono da função,
-- então o visitante anônimo pode chamá-la sem ter permissão de
-- UPDATE direto na tabela.
-- ------------------------------------------------------------
create or replace function incrementar_clique_sympla(evento_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update eventos
  set cliques_sympla = cliques_sympla + 1
  where id = evento_id;
$$;

-- Permite que qualquer visitante (anon) e usuários logados chamem a função.
grant execute on function incrementar_clique_sympla(uuid) to anon, authenticated;

-- ------------------------------------------------------------
-- Verificação
-- ------------------------------------------------------------
-- select id, titulo, cliques_sympla from eventos order by cliques_sympla desc;
