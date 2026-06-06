-- Presença Querida - v6
-- Rode este patch depois dos SQLs anteriores.
-- Ele cria tabelas para planos, promoções, clientes e primeiro acesso do cliente.

create extension if not exists pgcrypto;

alter table public.profiles add column if not exists must_change_password boolean not null default false;

create table if not exists public.acquisition_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tag text not null default '',
  description text not null default '',
  ideal_for text not null default '',
  reference_price text not null default '',
  founder_price text not null default 'Sem custo',
  founder_slots_total integer not null default 5,
  founder_slots_used integer not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 50,
  features text[] not null default '{}',
  cta_label text not null default 'Quero ser cliente fundador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text not null default '',
  status text not null default 'lead',
  plan_slug text references public.acquisition_plans(slug) on delete set null,
  event_slug text references public.events(slug) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  plan_slug text references public.acquisition_plans(slug) on delete cascade,
  title text not null,
  description text not null default '',
  slots_total integer not null default 5,
  slots_used integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_acquisition_plans_slug on public.acquisition_plans(slug);
create index if not exists idx_clients_email on public.clients(email);
create index if not exists idx_clients_event_slug on public.clients(event_slug);
create index if not exists idx_promotions_plan_slug on public.promotions(plan_slug);

alter table public.acquisition_plans enable row level security;
alter table public.clients enable row level security;
alter table public.promotions enable row level security;

insert into public.acquisition_plans (slug, name, tag, description, ideal_for, reference_price, founder_price, founder_slots_total, founder_slots_used, sort_order, features, cta_label)
values
('essencial', 'Essencial', 'Cliente opera', 'Página do evento, confirmação de presença, lista de convidados, link individual e painel simples.', 'Festas pequenas e familiares.', 'R$ 297', 'Sem custo', 5, 0, 1, array['Convite digital com identidade','Links individuais','Painel de confirmados e pendentes'], 'Quero ser cliente fundador'),
('organizado', 'Organizado', 'Mais controle', 'Importação de convidados, grupos, mensagens por fase, controle de pendentes, exportação e histórico.', 'Aniversários, bodas e eventos com muitas confirmações.', 'R$ 597', 'Sem custo', 5, 0, 2, array['Importação por CSV','Grupos de convidados','Mensagens prontas por etapa'], 'Quero ser cliente fundador'),
('memoravel', 'Memorável', 'Mais carinho', 'História da pessoa, foto da aniversariante, recados, depoimentos, agradecimento e galeria pós-evento.', '50, 60, 70 anos, bodas e festas surpresa.', 'R$ 1.197', 'Sem custo', 5, 0, 3, array['Página afetiva da pessoa','Mural de recados','Memória pós-evento'], 'Quero ser cliente fundador'),
('assistido', 'Assistido', 'AE apoia operação', 'A Automação Extrema ajuda na configuração, mensagens, acompanhamento dos pendentes e relatório final.', 'Famílias que querem cuidado sem operar o sistema.', 'R$ 1.997', 'Sem custo', 5, 0, 4, array['Configuração assistida','Apoio em mensagens','Relatório final'], 'Quero ser cliente fundador')
on conflict (slug) do update set
  name = excluded.name,
  tag = excluded.tag,
  description = excluded.description,
  ideal_for = excluded.ideal_for,
  reference_price = excluded.reference_price,
  founder_price = excluded.founder_price,
  founder_slots_total = excluded.founder_slots_total,
  sort_order = excluded.sort_order,
  features = excluded.features,
  cta_label = excluded.cta_label,
  is_active = true;

insert into public.promotions (plan_slug, title, description, slots_total, slots_used, is_active)
select slug, 'Programa Cliente Fundador', 'Primeiros 5 clientes de cada plano sem custo em troca de depoimento, vídeo, feedback e autorização de uso do case.', 5, founder_slots_used, true
from public.acquisition_plans
on conflict do nothing;
