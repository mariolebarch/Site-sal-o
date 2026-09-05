-- Studio Rosely Lebarch — migração: permitir múltiplos procedimentos por agendamento
-- Rode este script em: Supabase Studio → SQL Editor → New query → Run
-- (só é necessário se você já rodou o schema.sql original antes desta mudança)
-- Pode ser executado mais de uma vez sem problema, mesmo que já tenha rodado antes.

alter table appointments add column if not exists service_ids text[];

update appointments
set service_ids = array[service_id]
where service_ids is null and service_id is not null;

-- garante que nenhuma linha fique com service_ids nulo antes do passo seguinte
update appointments set service_ids = '{}' where service_ids is null;

alter table appointments alter column service_ids set not null;
alter table appointments alter column service_id drop not null;
