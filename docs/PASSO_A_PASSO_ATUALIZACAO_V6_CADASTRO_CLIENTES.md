# Presença Querida — atualização v6

## O que mudou

- Clientes passam a ser cadastrados pela área de Gestão do Presença Querida.
- O único usuário criado manualmente no Supabase deve ser `presencaquerida@gmail.com`, com perfil `gestao`.
- A Gestão cria cliente, evento, plano e acesso do cliente.
- O cliente recebe uma senha temporária e um link de troca de senha para primeiro acesso.
- Planos de aquisição passaram a ser cadastráveis e editáveis pela Gestão.
- A landing passa a mostrar valor de referência riscado e condição de Cliente Fundador sem custo para as primeiras vagas.
- Cabeçalho mobile ajustado para manter a faixa da Automação Extrema legível.
- Rodapé padrão de solução Automação Extrema incluído.

## Link da Gestão

Produção:

```txt
https://presenca-querida.vercel.app/gestao
```

Local:

```txt
http://localhost:3000/gestao
```

Acesso inicial:

```txt
presencaquerida@gmail.com
```

## Atualização local

1. Extraia o ZIP na raiz do projeto, substituindo os arquivos.
2. Rode:

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
```

3. Teste:

```powershell
npm run dev
```

## SQL no Supabase

Rode no SQL Editor:

```txt
supabase/sql/05_cadastro_clientes_planos.sql
supabase/sql/03_profiles_usuarios.sql
```

O arquivo `03_profiles_usuarios.sql` agora cria somente o perfil de Gestão para `presencaquerida@gmail.com`.

## Variáveis necessárias no Vercel

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://presenca-querida.vercel.app
ADMIN_ACCESS_TOKEN=troque-este-token
```

A chave `SUPABASE_SERVICE_ROLE_KEY` é necessária para a Gestão criar usuários no Supabase Auth. Ela nunca deve aparecer no navegador.

## Fluxo de cadastro de cliente

1. Entrar em `/gestao`.
2. Preencher **Novo cliente**.
3. Selecionar o plano.
4. Cadastrar evento e pessoa homenageada.
5. Clicar em **Criar cliente e acesso**.
6. Copiar senha temporária e link de troca de senha.
7. Enviar ao cliente pelo canal combinado.
8. O cliente faz login, troca a senha e acessa `/cliente/<slug-do-evento>`.

## Estratégia dos primeiros clientes

Recomendação: manter os valores de referência visíveis e riscados, com a condição:

> Cliente Fundador: sem custo para as primeiras vagas, em troca de depoimento, vídeo, feedback e autorização de uso do case.

Isso ajuda a preservar percepção de valor e evita que a solução seja percebida como simplesmente gratuita.
