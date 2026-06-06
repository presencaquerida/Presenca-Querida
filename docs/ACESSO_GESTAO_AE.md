# Presença Querida — acesso à Gestão

A área de Gestão não aparece mais no cabeçalho público da landing para evitar confusão com o acesso do cliente final.

## Link interno de Gestão

Use este link somente pela equipe da Automação Extrema:

```txt
/gestao
```

Em produção:

```txt
https://presenca-querida.vercel.app/gestao
```

## Usuário de Gestão

O login deve ser feito com o usuário criado no Supabase Auth:

```txt
presencaquerida@gmail.com
```

O perfil correspondente precisa existir na tabela `public.profiles` com:

```txt
role = gestao
active = true
```

## Usuário Cliente

O acesso público da landing usa o botão **Já é cliente** e direciona para `/login`.

O cliente Daniela deve usar:

```txt
daniela50@gmail.com
```

O perfil correspondente precisa existir na tabela `public.profiles` com:

```txt
role = cliente
event_slug = daniela-50
active = true
```

## Segurança

Mesmo sem o botão Gestão no cabeçalho público, a rota `/gestao` continua protegida por login e validação de perfil.

Se o usuário logado for cliente, a página de gestão exibe uma mensagem de acesso restrito.
