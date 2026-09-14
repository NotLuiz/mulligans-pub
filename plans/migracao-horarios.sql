-- ============================================================
-- MIGRAÇÃO — Horário de funcionamento estruturado
-- The Mulligan's Pub
-- ============================================================
-- Execute este script no Supabase → SQL Editor.
-- É idempotente: pode ser rodado mais de uma vez sem erro.
--
-- O que faz:
--   1. Adiciona a coluna `horarios` (jsonb) na tabela `configuracoes`.
--   2. Preenche a linha id = 1 com uma grade padrão (se estiver vazia).
--
-- Formato do jsonb:
--   {
--     "seg": { "fechado": true,  "abre": "18:00", "fecha": "23:00" },
--     "ter": { "fechado": true,  "abre": "18:00", "fecha": "23:00" },
--     "qua": { "fechado": false, "abre": "18:00", "fecha": "23:00" },
--     "qui": { "fechado": false, "abre": "18:00", "fecha": "23:00" },
--     "sex": { "fechado": false, "abre": "18:00", "fecha": "02:00" },
--     "sab": { "fechado": false, "abre": "18:00", "fecha": "02:00" },
--     "dom": { "fechado": false, "abre": "16:00", "fecha": "23:00" }
--   }
--
-- O campo antigo `horario_funcionamento` (texto livre) é mantido como
-- fallback: se `horarios` estiver vazio, o site usa o texto antigo.
-- ============================================================

alter table configuracoes
  add column if not exists horarios jsonb;

-- ------------------------------------------------------------
-- Grade padrão (opcional) — só preenche se ainda estiver nula.
-- Ajuste livremente depois pelo painel /admin → Configurações.
-- ------------------------------------------------------------
update configuracoes
set horarios = coalesce(
  horarios,
  '{
    "seg": { "fechado": true,  "abre": "18:00", "fecha": "23:00" },
    "ter": { "fechado": true,  "abre": "18:00", "fecha": "23:00" },
    "qua": { "fechado": false, "abre": "18:00", "fecha": "23:00" },
    "qui": { "fechado": false, "abre": "18:00", "fecha": "23:00" },
    "sex": { "fechado": false, "abre": "18:00", "fecha": "02:00" },
    "sab": { "fechado": false, "abre": "18:00", "fecha": "02:00" },
    "dom": { "fechado": false, "abre": "16:00", "fecha": "23:00" }
  }'::jsonb
)
where id = 1;

-- ------------------------------------------------------------
-- Verificação
-- ------------------------------------------------------------
-- select id, horarios, horario_funcionamento from configuracoes where id = 1;
