# Presença Querida — Atualização v8 Gestão/Login

## O que foi ajustado

- `/gestao` agora possui login próprio de gestão na própria página.
- O botão **Entrar como gestão** não aponta mais para `/login`, que é a tela de cliente.
- O login de gestão valida obrigatoriamente o perfil `gestao` no Supabase.
- Se o usuário não tiver perfil de gestão, o acesso é bloqueado com mensagem clara.
- O cabeçalho completo fica fixo no desktop e no mobile.
- O conteúdo recebeu espaçamento superior para não ficar escondido atrás do cabeçalho fixo.

## Link de gestão

Produção:

```txt
https://presenca-querida.vercel.app/gestao
```

Local:

```txt
http://localhost:3000/gestao
```

## Atualização

1. Extraia o ZIP na raiz do projeto.
2. Rode:

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
npm run check
```

3. Confirme no Supabase que o usuário `presencaquerida@gmail.com` existe em Authentication e tem perfil `gestao` ativo na tabela `profiles`.
4. Publique:

```powershell
git add .
git commit -m "Corrige login da gestao e header fixo"
git push
```
