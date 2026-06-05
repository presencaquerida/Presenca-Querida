-- Modelo para inserir convidados reais.
-- Dica: mantenha tokens aleatórios para convidados reais.

insert into public.guests (
  event_id,
  group_id,
  full_name,
  short_name,
  phone,
  token,
  status
)
select
  e.id,
  g.id,
  'NOME COMPLETO DO CONVIDADO',
  'NOME CURTO',
  '55DDDNUMERO',
  replace(gen_random_uuid()::text, '-', ''),
  'pending'
from public.events e
left join public.guest_groups g on g.event_id = e.id and g.name = 'Amigos do casal'
where e.slug = 'daniela-50';
