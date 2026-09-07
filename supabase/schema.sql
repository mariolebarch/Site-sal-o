-- Studio Rosely Lebarch — esquema do banco (Supabase / Postgres)
-- Rode este script inteiro em: Supabase Studio → SQL Editor → New query → Run
--
-- Este arquivo já cria o esquema final (com suporte a múltiplas
-- profissionais). Se seu banco já existia antes disso, use os arquivos
-- migration_002_*.sql e migration_003_*.sql em vez de rodar este de novo.
--
-- IMPORTANTE: antes de rodar, crie os logins das profissionais em
-- Authentication → Users → Add user (marque "Auto Confirm User"):
--   roselebarch@gmail.com  (será a administradora)
--   bete@gmail.com         (será profissional comum)
-- Se usar e-mails diferentes, troque abaixo antes de rodar.

create extension if not exists "pgcrypto";

-- ==========================================================
-- Tabelas
-- ==========================================================

create table if not exists professionals (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id text primary key,
  professional_id uuid not null references professionals(id),
  category_id text not null,
  name text not null,
  description text not null default '',
  duration_min integer not null check (duration_min > 0),
  price numeric(10, 2) not null check (price >= 0),
  active boolean not null default true
);

create table if not exists professional_hours (
  professional_id uuid primary key references professionals(id),
  business_hours jsonb not null
);

create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id),
  date date not null,
  reason text,
  constraint blocked_dates_date_professional_key unique (date, professional_id)
);

create table if not exists blocked_ranges (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id),
  date date not null,
  start_time text not null,
  end_time text not null,
  reason text,
  constraint blocked_ranges_time_order check (start_time < end_time)
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id),
  service_ids text[] not null,
  date date not null,
  start_time text not null,
  end_time text not null,
  client_name text not null,
  client_phone text not null,
  notes text,
  status text not null default 'confirmado' check (status in ('confirmado', 'cancelado')),
  created_at timestamptz not null default now()
);

create index if not exists appointments_date_idx on appointments (date);
create index if not exists blocked_ranges_date_idx on blocked_ranges (date);

-- ==========================================================
-- Row Level Security
-- ==========================================================

alter table professionals enable row level security;
alter table services enable row level security;
alter table professional_hours enable row level security;
alter table blocked_dates enable row level security;
alter table blocked_ranges enable row level security;
alter table appointments enable row level security;

-- Leitura pública (o site precisa mostrar profissionais, serviços,
-- horários e bloqueios para calcular a agenda disponível)
create policy "professionals_public_read" on professionals for select using (true);
create policy "services_public_read" on services for select using (true);
create policy "professional_hours_public_read" on professional_hours for select using (true);
create policy "blocked_dates_public_read" on blocked_dates for select using (true);
create policy "blocked_ranges_public_read" on blocked_ranges for select using (true);

-- Escrita: administradora mexe em tudo; cada profissional só mexe no que é dela
create policy "professionals_admin_write" on professionals for all
  using (exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin'))
  with check (exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin'));

create policy "services_admin_write" on services for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

create policy "professional_hours_write" on professional_hours for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

create policy "blocked_dates_admin_write" on blocked_dates for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

create policy "blocked_ranges_admin_write" on blocked_ranges for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

-- Agendamentos: qualquer visitante pode criar (agendar), mas só a
-- profissional dona do agendamento (ou a administradora) pode ver/editar/cancelar
create policy "appointments_public_insert" on appointments for insert with check (true);

create policy "appointments_read" on appointments for select
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

create policy "appointments_update" on appointments for update
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

create policy "appointments_delete" on appointments for delete
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

-- ==========================================================
-- Função pública para calcular horários ocupados de uma profissional
-- (não expõe nome/telefone do cliente, só os horários)
-- ==========================================================

create or replace function get_booked_slots(p_date date, p_professional_id uuid)
returns table (start_time text, end_time text)
language sql
security definer
set search_path = public
as $$
  select start_time, end_time
  from appointments
  where date = p_date and status = 'confirmado' and professional_id = p_professional_id;
$$;

grant execute on function get_booked_slots(date, uuid) to anon, authenticated;

-- ==========================================================
-- Dados iniciais
-- ==========================================================

insert into professionals (email, name, role) values
  ('roselebarch@gmail.com', 'Rose Lebarch', 'admin'),
  ('bete@gmail.com', 'Bete', 'staff')
on conflict (email) do nothing;

insert into professional_hours (professional_id, business_hours)
select id, '{
    "0": {"open": false, "start": "09:00", "end": "18:00"},
    "1": {"open": false, "start": "09:00", "end": "19:00"},
    "2": {"open": true,  "start": "09:00", "end": "19:00"},
    "3": {"open": true,  "start": "09:00", "end": "19:00"},
    "4": {"open": true,  "start": "09:00", "end": "19:00"},
    "5": {"open": true,  "start": "09:00", "end": "19:00"},
    "6": {"open": true,  "start": "09:00", "end": "17:00"}
  }'::jsonb
from professionals
on conflict (professional_id) do nothing;

insert into services (id, professional_id, category_id, name, description, duration_min, price, active)
select
  'manicure-tradicional', id, 'maos', 'Manicure Tradicional', 'Cutilagem, lixamento e esmaltação tradicional.', 45, 35, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'esmaltacao-gel-maos', id, 'maos', 'Esmaltação em Gel', 'Esmaltação em gel de alta duração com acabamento espelhado.', 60, 50, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'alongamento-fibra', id, 'maos', 'Alongamento em Fibra de Vidro', 'Alongamento leve e resistente, acabamento natural.', 120, 120, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'alongamento-acrigel', id, 'maos', 'Alongamento em Acrigel', 'Alongamento em acrigel com alta durabilidade.', 150, 150, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'manutencao-alongamento', id, 'maos', 'Manutenção de Alongamento', 'Ajuste e reforço do alongamento já existente.', 90, 80, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'banho-de-gel', id, 'maos', 'Banho de Gel', 'Fortalecimento e brilho intenso para unhas naturais.', 60, 55, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'pedicure-tradicional', id, 'pes', 'Pedicure Tradicional', 'Cutilagem, lixamento e esmaltação tradicional dos pés.', 50, 40, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'spa-dos-pes', id, 'pes', 'Spa dos Pés', 'Esfoliação, hidratação profunda e massagem relaxante.', 70, 65, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'esmaltacao-gel-pes', id, 'pes', 'Esmaltação em Gel — Pés', 'Esmaltação em gel de alta duração para os pés.', 45, 45, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'nail-art-simples', id, 'nailart', 'Nail Art Simples', 'Adesivos, francesinha ou desenhos delicados (até 2 unhas).', 20, 15, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'nail-art-elaborada', id, 'nailart', 'Nail Art Elaborada', 'Desenhos autorais, pedrarias e efeitos 3D.', 45, 35, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'encapsulado', id, 'nailart', 'Encapsulado / Baby Boomer', 'Técnicas especiais de degradê e encapsulamento.', 40, 30, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'combo-maos-pes', id, 'combos', 'Manicure + Pedicure', 'Combo completo para mãos e pés no mesmo horário.', 90, 70, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'dia-de-noiva', id, 'combos', 'Dia de Noiva', 'Manicure + Pedicure + Nail Art especial para o grande dia.', 180, 180, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'remocao-alongamento', id, 'extras', 'Remoção de Alongamento', 'Remoção segura de alongamento anterior.', 30, 25, true
from professionals where email = 'roselebarch@gmail.com'
union all
select 'blindagem', id, 'extras', 'Blindagem de Unhas', 'Fortalecimento para unhas fracas e quebradiças.', 40, 35, true
from professionals where email = 'roselebarch@gmail.com'
on conflict (id) do nothing;
