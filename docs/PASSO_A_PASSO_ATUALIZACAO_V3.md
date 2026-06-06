# Passo a passo — atualização v3

## 1. Backup

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
git status
git add .
git commit -m "Backup antes dos ajustes v3 Presenca Querida"
```

Se o Git informar que não há alterações, siga para o próximo passo.

## 2. Extrair o ZIP

Extraia o conteúdo de `presenca-querida-ajustes-v3-corrigido.zip` dentro da pasta do projeto:

```txt
C:\Users\lacos\Documents\GitHub\presenca-querida
```

Substitua os arquivos existentes.

## 3. Limpar e validar

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
```

Depois rode também:

```powershell
npm run check
```

## 4. Conferir Supabase

Confirme que estes usuários existem em Authentication > Users:

```txt
daniela50@gmail.com
presencaquerida@gmail.com
```

Depois rode ou reexecute:

```txt
supabase/sql/03_profiles_usuarios.sql
```

## 5. Testar localmente

```powershell
npm run dev
```

Teste:

```txt
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/cliente/daniela-50
http://localhost:3000/gestao
http://localhost:3000/convite/ana-silva-dani50
```

## 6. Publicar

```powershell
git add .
git commit -m "Ajusta header, area cliente e acesso gestao Presenca Querida"
git push
```
