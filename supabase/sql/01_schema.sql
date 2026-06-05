-- Presença Querida - schema completo
-- Rode no SQL Editor do Supabase.
-- Depois rode 02_seed_daniela.sql e 03_profiles_usuarios.sql.

create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  honoree_full_name text not null,
  honoree_photo_url text not null default '/daniela-placeholder.svg',
  headline text not null default '',
  description text not null default '',
  event_date date not null,
  start_time time not null,
  end_time time not null,
  location_name text not null default '',
  location_url text not null default '',
  address text not null default '',
  band_name text not null default '',
  band_url text not null default '',
  band_start_time time,
  band_end_time time,
  buffet_name text not null default '',
  buffet_url text not null default '',
  is_surprise boolean not null default false,
  theme text not null default '',
  privacy_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guest_groups (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  tone text not null default 'carinhoso',
  created_at timestamptz not null default now(),
  unique(event_id, name)
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  group_id uuid references public.guest_groups(id) on delete set null,
  full_name text not null,
  short_name text not null default '',
  phone text not null default '',
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'save_date_sent', 'invited', 'confirmed', 'maybe', 'declined')),
  invited_names text[] not null default '{}',
  max_companions_adults integer not null default 0 check (max_companions_adults >= 0),
  max_companions_children integer not null default 0 check (max_companions_children >= 0),
  companions_adults integer not null default 0 check (companions_adults >= 0),
  companions_children integer not null default 0 check (companions_children >= 0),
  dietary_notes text not null default '',
  notes text not null default '',
  last_message_stage text not null default '',
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  stage text not null,
  audience text not null default 'todos',
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  unique(event_id, stage, audience)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  category text not null default 'geral',
  status text not null default 'pending' check (status in ('pending', 'done')),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.guest_memories (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text not null default '',
  message text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null check (role in ('gestao', 'cliente')),
  event_slug text references public.events(slug) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_pipeline (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stage text not null default 'Diagnóstico',
  next_step text not null default '',
  owner text not null default 'Presença Querida',
  created_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  plan text not null,
  status text not null default 'Em implantação',
  monthly_value text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_guests_event_id on public.guests(event_id);
create index if not exists idx_guests_token on public.guests(token);
create index if not exists idx_guests_status on public.guests(status);
create index if not exists idx_guest_groups_event_id on public.guest_groups(event_id);
create index if not exists idx_message_templates_event_id on public.message_templates(event_id);
create index if not exists idx_tasks_event_id on public.tasks(event_id);
create index if not exists idx_profiles_email on public.profiles(email);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at before update on public.events for each row execute function public.set_updated_at();

drop trigger if exists trg_guests_updated_at on public.guests;
create trigger trg_guests_updated_at before update on public.guests for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.guest_groups enable row level security;
alter table public.guests enable row level security;
alter table public.message_templates enable row level security;
alter table public.tasks enable row level security;
alter table public.guest_memories enable row level security;
alter table public.profiles enable row level security;
alter table public.sales_pipeline enable row level security;
alter table public.contracts enable row level security;

-- Leitura do proprio perfil no navegador. O restante do app usa rotas server-side com service role.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);

-- Service role ignora RLS. Não exponha SUPABASE_SERVICE_ROLE_KEY no navegador.
