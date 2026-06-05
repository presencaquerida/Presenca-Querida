-- 02_seed_daniela_corrigido.sql
-- Correção: garante a coluna honoree_photo_url e índices necessários antes do seed.
-- Rode este arquivo no SQL Editor do Supabase no lugar do 02_seed_daniela.sql anterior.

-- Compatibilidade da tabela de eventos
alter table public.events add column if not exists honoree_photo_url text;
alter table public.events add column if not exists address text;
alter table public.events add column if not exists location_url text;
alter table public.events add column if not exists band_name text;
alter table public.events add column if not exists band_url text;
alter table public.events add column if not exists band_start_time time;
alter table public.events add column if not exists band_end_time time;
alter table public.events add column if not exists buffet_name text;
alter table public.events add column if not exists buffet_url text;
alter table public.events add column if not exists is_surprise boolean default false;
alter table public.events add column if not exists theme text;
alter table public.events add column if not exists privacy_note text;

-- Garante que o ON CONFLICT abaixo funcione
create unique index if not exists events_slug_key on public.events (slug);

-- Compatibilidade dos grupos de convidados
alter table public.guest_groups add column if not exists tone text;
create unique index if not exists guest_groups_event_id_name_key on public.guest_groups (event_id, name);

-- Compatibilidade dos convidados
alter table public.guests add column if not exists group_id uuid references public.guest_groups(id) on delete set null;
alter table public.guests add column if not exists short_name text;
alter table public.guests add column if not exists phone text;
alter table public.guests add column if not exists token text;
alter table public.guests add column if not exists status text default 'pending';
alter table public.guests add column if not exists invited_names text[] default array[]::text[];
alter table public.guests add column if not exists companions_adults integer default 0;
alter table public.guests add column if not exists companions_children integer default 0;
alter table public.guests add column if not exists max_companions_adults integer default 0;
alter table public.guests add column if not exists max_companions_children integer default 0;
alter table public.guests add column if not exists notes text;
create unique index if not exists guests_token_key on public.guests (token);

-- Compatibilidade dos modelos de mensagem
create unique index if not exists message_templates_event_stage_audience_key
on public.message_templates (event_id, stage, audience);

-- Início do seed da Daniela

insert into public.events (
  slug, title, honoree_full_name, honoree_photo_url, headline, description, event_date, start_time, end_time,
  location_name, location_url, address, band_name, band_url, band_start_time, band_end_time,
  buffet_name, buffet_url, is_surprise, theme, privacy_note
) values (
  'daniela-50', 'Dani 50', 'Daniela Mattano da Silva', '/daniela-placeholder.svg',
  'Uma tarde tropical para celebrar a vida da Dani',
  'Primeira cliente do Presença Querida: experiência mobile-first para convidar, lembrar e confirmar presenças com carinho, elegância e controle.',
  '2026-12-19', '12:30', '17:30',
  'Chácara Piloto', 'https://www.instagram.com/chacara.piloto?igsh=MWxobnJham9tMXQyZg==',
  'Endereço completo a validar com a família.',
  'Raça de Quintal', 'https://www.instagram.com/racadequintal?igsh=NmZjOGJxenNic3Ni', '13:30', '16:30',
  'Magali Góes / J_M Festas', 'https://www.instagram.com/magali.goes.9?igsh=cW50c2dyamFmYmNp', true,
  'Tropical elegante: rosa pink, laranja, verde musgo e detalhes dourados.',
  'Os dados dos convidados são usados somente para organizar esta celebração e podem ser removidos após o evento.'
) on conflict (slug) do update set
  title = excluded.title,
  honoree_full_name = excluded.honoree_full_name,
  honoree_photo_url = excluded.honoree_photo_url,
  headline = excluded.headline,
  description = excluded.description,
  event_date = excluded.event_date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  location_name = excluded.location_name,
  location_url = excluded.location_url,
  address = excluded.address,
  band_name = excluded.band_name,
  band_url = excluded.band_url,
  band_start_time = excluded.band_start_time,
  band_end_time = excluded.band_end_time,
  buffet_name = excluded.buffet_name,
  buffet_url = excluded.buffet_url,
  is_surprise = excluded.is_surprise,
  theme = excluded.theme,
  privacy_note = excluded.privacy_note;

with ev as (select id from public.events where slug = 'daniela-50')
insert into public.guest_groups (event_id, name, tone)
select ev.id, x.name, x.tone from ev, (values
  ('Família da Daniela', 'carinhoso'),
  ('Família do Gabriel', 'carinhoso'),
  ('Amigos do casal', 'leve'),
  ('Convidados especiais', 'elegante')
) as x(name, tone)
on conflict (event_id, name) do update set tone = excluded.tone;

with ev as (select id from public.events where slug = 'daniela-50'),
gp as (select id from public.guest_groups where name = 'Família da Daniela' and event_id = (select id from ev))
insert into public.guests (event_id, group_id, full_name, short_name, phone, token, status, invited_names, max_companions_adults, max_companions_children, notes)
select ev.id, gp.id, 'Ana Silva', 'Ana', '', 'ana-silva-dani50', 'pending', array['Ana Silva'], 1, 2, 'Demo de convite individual.' from ev, gp
on conflict (token) do update set invited_names = excluded.invited_names, max_companions_adults = excluded.max_companions_adults, max_companions_children = excluded.max_companions_children;

with ev as (select id from public.events where slug = 'daniela-50'),
gp as (select id from public.guest_groups where name = 'Família do Gabriel' and event_id = (select id from ev))
insert into public.guests (event_id, group_id, full_name, short_name, phone, token, status, invited_names, companions_adults, companions_children, notes)
select ev.id, gp.id, 'Marcos, Paula e filhos', 'Marcos', '', 'marcos-familia-dani50', 'confirmed', array['Marcos','Paula','Lucas','Lívia'], 2, 2, 'Exemplo de convite com mais de uma pessoa no mesmo link.' from ev, gp
on conflict (token) do update set invited_names = excluded.invited_names;

with ev as (select id from public.events where slug = 'daniela-50')
insert into public.message_templates (event_id, stage, audience, title, body)
select ev.id, x.stage, x.audience, x.title, x.body from ev, (values
  ('save_the_date','todos','Save the date carinhoso','Oi, {{nome}}! Tudo bem? Estamos preparando uma celebração muito especial: os 50 anos da Dani. 💛\n\nA ideia é uma tarde tropical, leve e cheia de carinho no dia {{data}}, das {{horario}}.\n\nAinda vamos mandar o convite oficial, mas já queríamos pedir para você reservar essa data. {{segredo}}'),
  ('convite_oficial','todos','Convite oficial com link','Oi, {{nome}}! Seu convite para os 50 anos da Dani está separado com muito carinho. 🌺\n\nEste convite está em nome de: {{convidados}}.\n\nSerá no dia {{data}}, das {{horario}}, na {{local}}. A banda {{banda}} toca das 13h30 às 16h30.\n\nPara nos ajudar na organização do buffet e das lembrancinhas, confirme por aqui: {{link}}\n\n{{segredo}}'),
  ('lembrete_pendente','pendentes','Lembrete elegante para pendentes','Oi, {{nome}}! Passando só para lembrar com carinho do convite dos 50 anos da Dani. 💚\n\nSua confirmação ajuda bastante na organização do buffet, mesas e lembrancinhas. Pode responder pelo link: {{link}}\n\nSem pressão, é só para conseguirmos organizar tudo com cuidado. {{segredo}}'),
  ('orientacao_final','confirmados','Orientação final para confirmados','Oi, {{nome}}! Está chegando o dia da celebração da Dani. 🌿\n\nSerá das {{horario}}, na {{local}}. A banda começa às 13h30.\n\nEstamos felizes demais com sua presença. {{segredo}}')
) as x(stage, audience, title, body)
on conflict (event_id, stage, audience) do update set title = excluded.title, body = excluded.body;

with ev as (select id from public.events where slug = 'daniela-50')
insert into public.tasks (event_id, title, category, status, due_date)
select ev.id, x.title, x.category, 'pending', x.due_date::date from ev, (values
  ('Importar lista real de convidados', 'convidados', '2026-08-01'),
  ('Enviar save the date para grupos prioritários', 'mensagens', '2026-08-15'),
  ('Validar endereço completo e referência de chegada', 'evento', '2026-10-01'),
  ('Fechar estimativa final com buffet', 'buffet', '2026-12-05')
) as x(title, category, due_date);

insert into public.sales_pipeline (name, stage, next_step, owner) values
('Daniela 50', 'Cliente fundador', 'Validar lista de convidados', 'Automação Extrema')
on conflict do nothing;

insert into public.contracts (client_name, plan, status, monthly_value) values
('Daniela Mattano da Silva', 'Memorável fundador', 'Em implantação', 'Piloto')
on conflict do nothing;
