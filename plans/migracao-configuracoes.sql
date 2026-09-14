-- ============================================================
-- MIGRAÇÃO — Tabela `configuracoes` (The Mulligan's Pub)
-- ============================================================
-- Execute este script no Supabase → SQL Editor.
-- É idempotente: pode ser rodado mais de uma vez sem erro.
-- ============================================================

alter table configuracoes
  add column if not exists endereco_completo      text,
  add column if not exists link_sympla            text,
  add column if not exists horario_funcionamento  text,
  add column if not exists aniversario_titulo     text,
  add column if not exists aniversario_condicoes  text,
  add column if not exists aniversario_voucher    text,
  add column if not exists evento_privado_texto   text;

-- ------------------------------------------------------------
-- Valores iniciais (opcional) — preenche a linha id = 1
-- com o endereço real e as condições de aniversário.
-- Ajuste os textos livremente depois pelo painel /admin.
-- ------------------------------------------------------------
update configuracoes
set
  endereco_completo = coalesce(
    endereco_completo,
    'Rua Pium-Í, 229 - Cruzeiro, Belo Horizonte - MG, 30310-080'
  ),
  aniversario_titulo = coalesce(
    aniversario_titulo,
    'Seu Aniversário no Mulligan''s'
  ),
  aniversario_condicoes = coalesce(
    aniversario_condicoes,
    E'Aniversariante não paga a entrada\nMesa reservada para grupos a partir de 6 pessoas\nGuardamos o seu bolo durante a festa (não fornecemos bolo)'
  ),
  aniversario_voucher = coalesce(
    aniversario_voucher,
    E'De 6 a 9 pessoas: voucher de R$ 50 para consumir no bar\nDe 10 a 15 pessoas: voucher de R$ 100 para consumir no bar\nAcima de 15 pessoas: voucher de R$ 150 + mesa exclusiva'
  )
where id = 1;

-- ------------------------------------------------------------
-- Verificação
-- ------------------------------------------------------------
-- select * from configuracoes where id = 1;
