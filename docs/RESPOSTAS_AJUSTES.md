# Respostas aos ajustes solicitados

## Demo Daniela 50

A seção comercial "Demo Daniela 50" foi retirada da landing principal. A demo permanece como área interna do cliente em `/cliente/daniela-50` e como convites de exemplo.

## Modelo para importação

Incluído em:

- `docs/CONVIDADOS_MODELO.csv`
- `public/modelos/convidados-modelo.csv`

O botão de download aparece na landing, área cliente e gestão.

## Foto da aniversariante

Incluído campo `honoree_photo_url` no evento. O placeholder está em `public/daniela-placeholder.svg`. Para usar foto real, coloque o arquivo em `public/uploads/daniela.jpg` e atualize o campo no Supabase para `/uploads/daniela.jpg`.

## Página dinâmica por convidado

A página do convidado é dinâmica por token: `/convite/[token]`. Assim, o convidado não precisa preencher nome. A página já sabe para quem é o convite.

## Mais de uma pessoa no mesmo invite

Incluído campo `invited_names`, permitindo um invite para casal, família ou grupo. Exemplo: `/convite/marcos-familia-dani50`.

## Depoimento pós-confirmação

Depois de confirmar presença, o convidado pode enviar depoimento ou história engraçada. O depoimento entra como pendente e a Gestão aprova antes de aparecer no mural.

## Monetização

A landing e a apresentação trazem os modelos: implantação, mensalidade, operação assistida, WhatsApp/CRM, pós-evento e white label.
