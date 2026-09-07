-- Studio Rosely Lebarch — migração: múltiplas profissionais (Rose + Bete)
-- Rode este script em: Supabase Studio → SQL Editor → New query → Run
-- Pode ser executado mais de uma vez sem problema.
--
-- IMPORTANTE: antes de rodar, crie os logins das duas em
-- Authentication → Users → Add user (marque "Auto Confirm User"):
--   roselebarch@gmail.com  (será a administradora)
--   bete@gmail.com         (será profissional comum)
-- Se usar e-mails diferentes, troque abaixo antes de rodar.

-- ==========================================================
-- Tabela de profissionais
-- ==========================================================

create table if not exists professionals (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table professionals enable row level security;

drop policy if exists "professionals_public_read" on professionals;
create policy "professionals_public_read" on professionals for select using (true);

drop policy if exists "professionals_admin_write" on professionals;
create policy "professionals_admin_write" on professionals for all
  using (
    exists (
      select 1 from professionals p
      where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from professionals p
      where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin'
    )
  );

insert into professionals (email, name, role) values
  ('roselebarch@gmail.com', 'Rose Lebarch', 'admin'),
  ('bete@gmail.com', 'Bete', 'staff')
on conflict (email) do nothing;

-- ==========================================================
-- Serviços por profissional
-- ==========================================================

alter table services add column if not exists professional_id uuid references professionals(id);

update services set professional_id = (select id from professionals where email = 'roselebarch@gmail.com')
where professional_id is null;

alter table services alter column professional_id set not null;

drop policy if exists "services_admin_write" on services;
create policy "services_admin_write" on services for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

-- ==========================================================
-- Horário de funcionamento por profissional
-- (substitui o antigo app_settings, que fica sem uso mas não é apagado)
-- ==========================================================

create table if not exists professional_hours (
  professional_id uuid primary key references professionals(id),
  business_hours jsonb not null
);

alter table professional_hours enable row level security;

drop policy if exists "professional_hours_public_read" on professional_hours;
create policy "professional_hours_public_read" on professional_hours for select using (true);

drop policy if exists "professional_hours_write" on professional_hours;
create policy "professional_hours_write" on professional_hours for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

insert into professional_hours (professional_id, business_hours)
select id, coalesce((select business_hours from app_settings where id = 'main'), '{
    "0": {"open": false, "start": "09:00", "end": "18:00"},
    "1": {"open": false, "start": "09:00", "end": "19:00"},
    "2": {"open": true,  "start": "09:00", "end": "19:00"},
    "3": {"open": true,  "start": "09:00", "end": "19:00"},
    "4": {"open": true,  "start": "09:00", "end": "19:00"},
    "5": {"open": true,  "start": "09:00", "end": "19:00"},
    "6": {"open": true,  "start": "09:00", "end": "17:00"}
  }'::jsonb)
from professionals
where email in ('roselebarch@gmail.com', 'bete@gmail.com')
on conflict (professional_id) do nothing;

-- ==========================================================
-- Bloqueios por profissional
-- ==========================================================

alter table blocked_dates add column if not exists professional_id uuid references professionals(id);
update blocked_dates set professional_id = (select id from professionals where email = 'roselebarch@gmail.com')
where professional_id is null;
alter table blocked_dates alter column professional_id set not null;

alter table blocked_dates drop constraint if exists blocked_dates_date_key;
drop index if exists blocked_dates_date_key;
alter table blocked_dates drop constraint if exists blocked_dates_date_professional_key;
alter table blocked_dates add constraint blocked_dates_date_professional_key unique (date, professional_id);

drop policy if exists "blocked_dates_admin_write" on blocked_dates;
create policy "blocked_dates_admin_write" on blocked_dates for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

alter table blocked_ranges add column if not exists professional_id uuid references professionals(id);
update blocked_ranges set professional_id = (select id from professionals where email = 'roselebarch@gmail.com')
where professional_id is null;
alter table blocked_ranges alter column professional_id set not null;

drop policy if exists "blocked_ranges_admin_write" on blocked_ranges;
create policy "blocked_ranges_admin_write" on blocked_ranges for all
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

-- ==========================================================
-- Agendamentos por profissional
-- ==========================================================

alter table appointments add column if not exists professional_id uuid references professionals(id);

update appointments a
set professional_id = coalesce(
  (select s.professional_id from services s where s.id = a.service_ids[1]),
  (select id from professionals where email = 'roselebarch@gmail.com')
)
where professional_id is null;

alter table appointments alter column professional_id set not null;

drop policy if exists "appointments_admin_read" on appointments;
drop policy if exists "appointments_read" on appointments;
create policy "appointments_read" on appointments for select
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

drop policy if exists "appointments_admin_write" on appointments;
drop policy if exists "appointments_update" on appointments;
create policy "appointments_update" on appointments for update
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

drop policy if exists "appointments_admin_delete" on appointments;
drop policy if exists "appointments_delete" on appointments;
create policy "appointments_delete" on appointments for delete
  using (
    exists (select 1 from professionals p where lower(p.email) = lower(auth.jwt() ->> 'email') and p.role = 'admin')
    or professional_id = (select id from professionals where lower(email) = lower(auth.jwt() ->> 'email'))
  );

-- ==========================================================
-- Horários ocupados por profissional (função pública)
-- ==========================================================

drop function if exists get_booked_slots(date);

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
