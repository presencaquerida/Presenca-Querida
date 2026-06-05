-- Presença Querida — demo da primeira cliente: Daniela Mattano da Silva
-- Rode este arquivo depois do 01_schema.sql.

begin;

delete from public.events where slug = 'daniela-50';

insert into public.events (
  slug,
  title,
  honoree_full_name,
  headline,
  description,
  event_date,
  start_time,
  end_time,
  location_name,
  location_url,
  address,
  band_name,
  band_url,
  band_start_time,
  band_end_time,
  buffet_name,
  buffet_url,
  is_surprise,
  theme,
  privacy_note
) values (
  'daniela-50',
  'Daniela 50 anos',
  'Daniela Mattano da Silva',
  'Uma tarde tropical para celebrar a vida da Dani',
  'Primeira demo do Presença Querida: convite, confirmação, mensagens por fase e painel de presença para uma festa afetiva e organizada.',
  '2026-12-19',
  '12:30',
  '17:30',
  'Chácara Piloto',
  'https://www.instagram.com/chacara.piloto?igsh=MWxobnJham9tMXQyZg==',
  'Local confirmado pela família. Enviar endereço completo na mensagem final.',
  'Raça de Quintal',
  'https://www.instagram.com/racadequintal?igsh=NmZjOGJxenNic3Ni',
  '13:30',
  '16:30',
  'Magali Góes / J_M Festas',
  'https://www.instagram.com/magali.goes.9?igsh=cW50c2dyamFmYmNp',
  true,
  'Tropical elegante: rosa pink, laranja, verde musgo e detalhes dourados.',
  'Os dados dos convidados são usados somente para organizar esta celebração e podem ser removidos após o evento.'
);

insert into public.guest_groups (event_id, name, tone)
select id, name, tone
from public.events,
(values
  ('Família da Daniela', 'carinhoso'),
  ('Família do Gabriel', 'carinhoso'),
  ('Amigos do casal', 'leve'),
  ('Convidados especiais', 'elegante')
) as groups(name, tone)
where slug = 'daniela-50';

insert into public.guests (
  event_id,
  group_id,
  full_name,
  short_name,
  phone,
  token,
  status,
  companions_adults,
  companions_children,
  dietary_notes,
  notes,
  last_message_stage
)
select
  e.id,
  g.id,
  v.full_name,
  v.short_name,
  v.phone,
  v.token,
  v.status,
  v.companions_adults,
  v.companions_children,
  v.dietary_notes,
  v.notes,
  v.last_message_stage
from public.events e
join public.guest_groups g on g.event_id = e.id
join (
  values
    ('Família da Daniela', 'Ana Silva', 'Ana', '', 'ana-silva-dani50', 'pending', 0, 0, '', 'Demo de convite individual.', ''),
    ('Família do Gabriel', 'Marcos e família', 'Marcos', '', 'marcos-familia-dani50', 'confirmed', 2, 1, '1 criança', 'Confirmou pelo link.', 'convite_oficial'),
    ('Amigos do casal', 'Cláudia Martins', 'Cláudia', '', 'claudia-martins-dani50', 'maybe', 0, 0, '', 'Vai confirmar após agenda de trabalho.', 'save_the_date'),
    ('Convidados especiais', 'Roberto Oliveira', 'Roberto', '', 'roberto-oliveira-dani50', 'declined', 0, 0, '', 'Agradeceu o convite, mas estará viajando.', 'convite_oficial'),
    ('Amigos do casal', 'Patrícia Souza', 'Patrícia', '', 'patricia-souza-dani50', 'save_date_sent', 0, 0, '', 'Precisa receber convite oficial.', 'save_the_date')
) as v(group_name, full_name, short_name, phone, token, status, companions_adults, companions_children, dietary_notes, notes, last_message_stage)
  on v.group_name = g.name
where e.slug = 'daniela-50';

insert into public.message_templates (event_id, stage, audience, title, body)
select e.id, v.stage, v.audience, v.title, v.body
from public.events e
join (
  values
    ('save_the_date', 'todos', 'Save the date carinhoso', 'Oi, {{nome}}! Tudo bem? Estamos preparando uma celebração muito especial: os 50 anos da Dani. 💛\n\nA ideia é uma tarde tropical, leve e cheia de carinho no dia {{data}}, das {{horario}}.\n\nAinda vamos mandar o convite oficial, mas já queríamos pedir para você reservar essa data. {{segredo}}'),
    ('convite_oficial', 'todos', 'Convite oficial com link', 'Oi, {{nome}}! Seu convite para os 50 anos da Dani está separado com muito carinho. 🌺\n\nSerá no dia {{data}}, das {{horario}}, na {{local}}. A banda {{banda}} toca das 13h30 às 16h30.\n\nPara nos ajudar na organização do buffet e das lembrancinhas, confirme por aqui: {{link}}\n\n{{segredo}}'),
    ('lembrete_pendente', 'pendentes', 'Lembrete elegante para pendentes', 'Oi, {{nome}}! Passando só para lembrar com carinho do convite dos 50 anos da Dani. 💚\n\nSua confirmação ajuda bastante na organização do buffet, mesas e lembrancinhas. Pode responder pelo link: {{link}}\n\nSem pressão, é só para conseguirmos organizar tudo com cuidado. {{segredo}}'),
    ('orientacao_final', 'confirmados', 'Orientação final para confirmados', 'Oi, {{nome}}! Está chegando o dia da celebração da Dani. 🌿\n\nSerá das {{horario}}, na {{local}}. A banda começa às 13h30.\n\nEstamos felizes demais com sua presença. {{segredo}}')
) as v(stage, audience, title, body) on true
where e.slug = 'daniela-50';

insert into public.tasks (event_id, title, category, status, due_date)
select e.id, v.title, v.category, v.status, v.due_date::date
from public.events e
join (
  values
    ('Importar lista real de convidados', 'convidados', 'pending', '2026-08-01'),
    ('Enviar save the date para grupos prioritários', 'mensagens', 'pending', '2026-08-15'),
    ('Validar endereço completo e referência de chegada', 'evento', 'pending', '2026-10-01'),
    ('Fechar estimativa final com buffet', 'buffet', 'pending', '2026-12-05')
) as v(title, category, status, due_date) on true
where e.slug = 'daniela-50';

commit;
