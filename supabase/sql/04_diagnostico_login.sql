-- 04_diagnostico_login.sql
-- Rode no SQL Editor do Supabase para conferir se os usuários do Auth possuem perfil no Presença Querida.

select
  u.email,
  u.id as auth_user_id,
  p.id as profile_id,
  p.full_name,
  p.role,
  p.event_slug,
  p.active
from auth.users u
left join public.profiles p on p.id = u.id
where u.email in (
  'daniela50@gmail.com',
  'presencaquerida@gmail.com',
  'marcioalex.silva@gmail.com'
)
order by u.email;

-- Resultado esperado:
-- daniela50@gmail.com          -> role cliente, event_slug daniela-50, active true
-- presencaquerida@gmail.com    -> role gestao, event_slug null, active true
-- marcioalex.silva@gmail.com   -> role gestao, event_slug null, active true (se este usuário existir no Auth)
