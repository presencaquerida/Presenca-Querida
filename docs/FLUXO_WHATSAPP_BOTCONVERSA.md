# Fluxo Presença Querida no WhatsApp / BotConversa

## Decisão recomendada

O melhor fluxo é híbrido:

1. A landing e os botões do Presença Querida levam para o WhatsApp da Automação Extrema com uma mensagem pronta.
2. A primeira resposta do BotConversa direciona o lead para a página `/diagnostico`.
3. A página de diagnóstico grava os dados direto na Gestão do Presença Querida.
4. Depois do diagnóstico, o atendimento continua pelo WhatsApp, já com contexto e plano provável.

Assim o WhatsApp vira o canal de relacionamento e a página vira o ponto de coleta estruturada de dados. Isso evita perder informações em conversas soltas e já coloca o lead no funil da Gestão.

## Mensagem de entrada dos botões

```txt
Olá! Vim pelo Presença Querida e quero iniciar o diagnóstico do meu evento.
```

Quando o botão está associado a um plano, a mensagem inclui o plano e o link do diagnóstico.

## Roteiro sugerido no BotConversa

### 1. Gatilho de entrada

Criar um fluxo chamado:

```txt
PQ - Diagnóstico - Entrada
```

Gatilhos possíveis:

```txt
presença querida
presenca querida
diagnóstico presença querida
diagnostico presenca querida
cliente fundador presença querida
```

### 2. Primeira mensagem

```txt
Olá! Que bom receber você 😊

O Presença Querida ajuda a organizar confirmações de presença com carinho, previsibilidade e menos cobrança.

Para indicar o melhor formato, preciso entender rapidinho seu evento.
```

### 3. Direcionar para a página de diagnóstico

```txt
O jeito mais rápido é preencher este diagnóstico:

https://presenca-querida.vercel.app/diagnostico?origem=botconversa

Assim eu já recebo as informações organizadas e consigo te responder com o melhor caminho.
```

### 4. Pergunta de fallback no WhatsApp

Se a pessoa não quiser abrir o link, coletar no WhatsApp:

1. Tipo de evento.
2. Data aproximada.
3. Quantidade de convidados.
4. Se já tem lista.
5. Se quer só confirmação ou também recados, história, lembretes e pós-evento.

### 5. Classificação

- **Essencial:** quer página e confirmação.
- **Organizado:** quer lista, grupos e mensagens por fase.
- **Memorável:** quer foto, história, depoimentos e pós-evento.
- **Assistido:** quer que a Automação Extrema ajude a operar.

### 6. Oferta Cliente Fundador

```txt
Como estamos validando os primeiros cases, temos vagas de Cliente Fundador.

Para os primeiros clientes, a implantação pode sair sem custo em troca de feedback, depoimento em texto/vídeo e autorização para uso do case na landing da solução.
```

### 7. Encaminhamento para fechamento

```txt
Com base no que você contou, o melhor formato parece ser o plano [PLANO].

Posso te explicar o que está incluso e, se fizer sentido, já criamos seu acesso para começar a organizar o evento.
```

## Como configurar no BotConversa

1. Acesse o BotConversa.
2. Vá em **Fluxos** ou **Automações**.
3. Crie um novo fluxo com o nome `PQ - Diagnóstico - Entrada`.
4. Cadastre as palavras-chave de entrada.
5. Adicione o bloco de mensagem de boas-vindas.
6. Adicione o bloco com o link da página `/diagnostico`.
7. Adicione uma opção alternativa: `Prefiro responder por aqui`.
8. Para a opção alternativa, crie perguntas uma a uma e salve as respostas em campos do contato, se seu plano permitir.
9. Marque o lead com uma tag, por exemplo:
   - `PQ Lead`
   - `PQ Diagnóstico iniciado`
   - `PQ Cliente fundador`
10. Opcional: use Webhook ou Bloco de Integração para enviar os dados para a API do Presença Querida.

## Observação importante sobre WhatsApp

Para escala, disparos e mensagens proativas, respeitar opt-in e boas práticas do WhatsApp. O caminho mais seguro é o lead iniciar a conversa pelo botão, aceitar receber retorno e preencher o diagnóstico.
