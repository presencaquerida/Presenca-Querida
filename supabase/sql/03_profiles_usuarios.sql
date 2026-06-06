-- Perfil inicial de Gestão.
-- A partir da versão v6, clientes são criados pela área /gestao do Presença Querida.
-- Portanto, crie manualmente no Supabase Auth apenas o usuário:
--   presencaquerida@gmail.com

alter table public.profiles add column if not exists must_change_password boolean not null default false;

insert into public.profiles (id, email, full_name, role, event_slug, active, must_change_password)
select id, email, 'Presença Querida Gestão', 'gestao', null, true, false
from auth.users
where email = 'presencaquerida@gmail.com'
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  event_slug = excluded.event_slug,
  active = true,
  must_change_password = false;

select email, full_name, role, event_slug, active, must_change_password from public.profiles order by role, email;
