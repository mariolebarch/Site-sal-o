-- Studio Rosely Lebarch — esquema do banco (Supabase / Postgres)
-- Rode este script inteiro em: Supabase Studio → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

-- ==========================================================
-- Tabelas
-- ==========================================================

create table if not exists services (
  id text primary key,
  category_id text not null,
  name text not null,
  description text not null default '',
  duration_min integer not null check (duration_min > 0),
  price numeric(10, 2) not null check (price >= 0),
  active boolean not null default true
);

create table if not exists app_settings (
  id text primary key default 'main',
  business_hours jsonb not null
);

create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text
);

create table if not exists blocked_ranges (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time text not null,
  end_time text not null,
  reason text,
  constraint blocked_ranges_time_order check (start_time < end_time)
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references services(id),
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

alter table services enable row level security;
alter table app_settings enable row level security;
alter table blocked_dates enable row level security;
alter table blocked_ranges enable row level security;
alter table appointments enable row level security;

-- Leitura pública (o site precisa mostrar serviços, horários e bloqueios
-- para calcular a agenda disponível)
create policy "services_public_read" on services for select using (true);
create policy "app_settings_public_read" on app_settings for select using (true);
create policy "blocked_dates_public_read" on blocked_dates for select using (true);
create policy "blocked_ranges_public_read" on blocked_ranges for select using (true);

-- Escrita apenas para a profissional logada (usuário autenticado no Supabase Auth)
create policy "services_admin_write" on services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "app_settings_admin_write" on app_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "blocked_dates_admin_write" on blocked_dates for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "blocked_ranges_admin_write" on blocked_ranges for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Agendamentos: qualquer visitante pode criar (agendar), mas só a
-- profissional autenticada pode ver/editar/cancelar (protege dados de clientes)
create policy "appointments_public_insert" on appointments for insert with check (true);
create policy "appointments_admin_read" on appointments for select
  using (auth.role() = 'authenticated');
create policy "appointments_admin_write" on appointments for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "appointments_admin_delete" on appointments for delete
  using (auth.role() = 'authenticated');

-- ==========================================================
-- Função pública para calcular horários ocupados
-- (não expõe nome/telefone do cliente, só os horários)
-- ==========================================================

create or replace function get_booked_slots(p_date date)
returns table (start_time text, end_time text)
language sql
security definer
set search_path = public
as $$
  select start_time, end_time
  from appointments
  where date = p_date and status = 'confirmado';
$$;

grant execute on function get_booked_slots(date) to anon, authenticated;

-- ==========================================================
-- Dados iniciais
-- ==========================================================

insert into app_settings (id, business_hours) values (
  'main',
  '{
    "0": {"open": false, "start": "09:00", "end": "18:00"},
    "1": {"open": false, "start": "09:00", "end": "19:00"},
    "2": {"open": true,  "start": "09:00", "end": "19:00"},
    "3": {"open": true,  "start": "09:00", "end": "19:00"},
    "4": {"open": true,  "start": "09:00", "end": "19:00"},
    "5": {"open": true,  "start": "09:00", "end": "19:00"},
    "6": {"open": true,  "start": "09:00", "end": "17:00"}
  }'::jsonb
) on conflict (id) do nothing;

insert into services (id, category_id, name, description, duration_min, price, active) values
  ('manicure-tradicional', 'maos', 'Manicure Tradicional', 'Cutilagem, lixamento e esmaltação tradicional.', 45, 35, true),
  ('esmaltacao-gel-maos', 'maos', 'Esmaltação em Gel', 'Esmaltação em gel de alta duração com acabamento espelhado.', 60, 50, true),
  ('alongamento-fibra', 'maos', 'Alongamento em Fibra de Vidro', 'Alongamento leve e resistente, acabamento natural.', 120, 120, true),
  ('alongamento-acrigel', 'maos', 'Alongamento em Acrigel', 'Alongamento em acrigel com alta durabilidade.', 150, 150, true),
  ('manutencao-alongamento', 'maos', 'Manutenção de Alongamento', 'Ajuste e reforço do alongamento já existente.', 90, 80, true),
  ('banho-de-gel', 'maos', 'Banho de Gel', 'Fortalecimento e brilho intenso para unhas naturais.', 60, 55, true),
  ('pedicure-tradicional', 'pes', 'Pedicure Tradicional', 'Cutilagem, lixamento e esmaltação tradicional dos pés.', 50, 40, true),
  ('spa-dos-pes', 'pes', 'Spa dos Pés', 'Esfoliação, hidratação profunda e massagem relaxante.', 70, 65, true),
  ('esmaltacao-gel-pes', 'pes', 'Esmaltação em Gel — Pés', 'Esmaltação em gel de alta duração para os pés.', 45, 45, true),
  ('nail-art-simples', 'nailart', 'Nail Art Simples', 'Adesivos, francesinha ou desenhos delicados (até 2 unhas).', 20, 15, true),
  ('nail-art-elaborada', 'nailart', 'Nail Art Elaborada', 'Desenhos autorais, pedrarias e efeitos 3D.', 45, 35, true),
  ('encapsulado', 'nailart', 'Encapsulado / Baby Boomer', 'Técnicas especiais de degradê e encapsulamento.', 40, 30, true),
  ('combo-maos-pes', 'combos', 'Manicure + Pedicure', 'Combo completo para mãos e pés no mesmo horário.', 90, 70, true),
  ('dia-de-noiva', 'combos', 'Dia de Noiva', 'Manicure + Pedicure + Nail Art especial para o grande dia.', 180, 180, true),
  ('remocao-alongamento', 'extras', 'Remoção de Alongamento', 'Remoção segura de alongamento anterior.', 30, 25, true),
  ('blindagem', 'extras', 'Blindagem de Unhas', 'Fortalecimento para unhas fracas e quebradiças.', 40, 35, true)
on conflict (id) do nothing;
