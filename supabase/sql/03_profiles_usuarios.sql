-- Perfis para usuários já criados no Supabase Auth.
-- Execute depois de criar os usuários em Authentication > Users.
-- E-mails informados:
--   daniela50@gmail.com -> cliente do evento daniela-50
--   presencaquerida@gmail.com -> gestão geral

insert into public.profiles (id, email, full_name, role, event_slug, active)
select id, email, 'Daniela Mattano da Silva', 'cliente', 'daniela-50', true
from auth.users
where email = 'daniela50@gmail.com'
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  event_slug = excluded.event_slug,
  active = true;

insert into public.profiles (id, email, full_name, role, event_slug, active)
select id, email, 'Presença Querida Gestão', 'gestao', null, true
from auth.users
where email = 'presencaquerida@gmail.com'
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  event_slug = excluded.event_slug,
  active = true;

-- Conferência:
select email, full_name, role, event_slug, active from public.profiles order by role, email;
