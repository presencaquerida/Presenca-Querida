# Presença Querida — atualização visual, comercial e correção do carregando

## O que esta versão corrige

1. Remove o botão **Entrar** do cabeçalho.
2. Mantém apenas **Cliente**, **Gestão** e **Sair** quando houver sessão ativa.
3. Ajusta a faixa **Desenvolvido por Automação Extrema** para não criar barra horizontal no celular.
4. Troca termos técnicos da página pública:
   - `RSVP` virou **confirmação de presença**.
   - `Mar Vermelho` virou **Jeito comum**.
   - `Oceano Azul` virou **Jeito Presença Querida**.
5. Troca os botões repetidos do primeiro bloco por CTA comercial.
6. Transforma “modelos de monetização” em **opções de aquisição** para o cliente.
7. Remove da página pública o download do CSV e o acesso ao sistema como próximo passo.
8. Corrige a área cliente que ficava presa em **Carregando...** porque faltavam rotas de API.
9. Inclui as rotas:
   - `/api/admin/[slug]`
   - `/api/guests/[token]`
   - `/convite/[token]`

## Atualização local

Na pasta do projeto:

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
```

Extraia o ZIP atualizado por cima da pasta atual, substituindo arquivos existentes.

Depois rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
```

## Testes locais

```powershell
npm run dev
```

Abrir:

```text
http://localhost:3000/
http://localhost:3000/cliente/daniela-50
http://localhost:3000/gestao
http://localhost:3000/convite/ana-silva-dani50
http://localhost:3000/convite/marcos-familia-dani50
```

## Supabase

Se ainda não rodou os SQLs, use esta ordem:

```text
supabase/sql/01_schema.sql
supabase/sql/02_seed_daniela.sql
supabase/sql/03_profiles_usuarios.sql
```

Se o evento e usuários já existem, rode pelo menos:

```text
supabase/sql/02_seed_daniela.sql
supabase/sql/03_profiles_usuarios.sql
```

## Deploy

Quando passar local:

```powershell
git add .
git commit -m "Ajusta landing, header e area cliente Presenca Querida"
git push
```

## Observação sobre checkout

Nesta fase, o botão de cada plano direciona para WhatsApp com mensagem pronta. Isso evita um checkout rígido antes de entender escopo, número de convidados, urgência, nível de suporte e se haverá pós-evento.
