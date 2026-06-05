import type { EventBundle } from "./types";

export const demoBundle: EventBundle = {
  event: {
    id: "demo-event-daniela-50",
    slug: "daniela-50",
    title: "Dani 50",
    honoreeFullName: "Daniela Mattano da Silva",
    honoreePhotoUrl: "/daniela-placeholder.svg",
    headline: "Uma tarde tropical para celebrar a vida da Dani",
    description:
      "Primeira cliente do Presença Querida: uma experiência mobile-first para convidar, lembrar e confirmar presenças com carinho, elegância e controle.",
    eventDate: "2026-12-19",
    startTime: "12:30",
    endTime: "17:30",
    locationName: "Chácara Piloto",
    locationUrl: "https://www.instagram.com/chacara.piloto?igsh=MWxobnJham9tMXQyZg==",
    address: "Local confirmado pela família. Enviar endereço completo na mensagem final.",
    bandName: "Raça de Quintal",
    bandUrl: "https://www.instagram.com/racadequintal?igsh=NmZjOGJxenNic3Ni",
    bandStartTime: "13:30",
    bandEndTime: "16:30",
    buffetName: "Magali Góes / J_M Festas",
    buffetUrl: "https://www.instagram.com/magali.goes.9?igsh=cW50c2dyamFmYmNp",
    isSurprise: true,
    theme: "Tropical elegante: rosa pink, laranja, verde musgo e detalhes dourados.",
    privacyNote:
      "Os dados dos convidados são usados somente para organizar esta celebração e podem ser removidos após o evento."
  },
  groups: [
    { id: "grupo-familia-daniela", eventId: "demo-event-daniela-50", name: "Família da Daniela", tone: "carinhoso" },
    { id: "grupo-familia-gabriel", eventId: "demo-event-daniela-50", name: "Família do Gabriel", tone: "carinhoso" },
    { id: "grupo-amigos", eventId: "demo-event-daniela-50", name: "Amigos do casal", tone: "leve" },
    { id: "grupo-convidados-especiais", eventId: "demo-event-daniela-50", name: "Convidados especiais", tone: "elegante" }
  ],
  guests: [
    {
      id: "guest-ana",
      eventId: "demo-event-daniela-50",
      groupId: "grupo-familia-daniela",
      fullName: "Ana Silva",
      shortName: "Ana",
      phone: "",
      token: "ana-silva-dani50",
      status: "pending",
      invitedNames: ["Ana Silva"],
      maxCompanionsAdults: 1,
      maxCompanionsChildren: 2,
      companionsAdults: 0,
      companionsChildren: 0,
      dietaryNotes: "",
      notes: "Demo de convite individual.",
      lastMessageStage: "",
      updatedAt: new Date().toISOString()
    },
    {
      id: "guest-marcos",
      eventId: "demo-event-daniela-50",
      groupId: "grupo-familia-gabriel",
      fullName: "Marcos, Paula e filhos",
      shortName: "Marcos",
      phone: "",
      token: "marcos-familia-dani50",
      status: "confirmed",
      invitedNames: ["Marcos", "Paula", "Lucas", "Lívia"],
      maxCompanionsAdults: 0,
      maxCompanionsChildren: 0,
      companionsAdults: 2,
      companionsChildren: 2,
      dietaryNotes: "2 crianças",
      notes: "Exemplo de convite com mais de uma pessoa no mesmo link.",
      lastMessageStage: "convite_oficial",
      updatedAt: new Date().toISOString()
    },
    {
      id: "guest-claudia",
      eventId: "demo-event-daniela-50",
      groupId: "grupo-amigos",
      fullName: "Cláudia Martins",
      shortName: "Cláudia",
      phone: "",
      token: "claudia-martins-dani50",
      status: "maybe",
      invitedNames: ["Cláudia Martins"],
      maxCompanionsAdults: 1,
      maxCompanionsChildren: 0,
      companionsAdults: 0,
      companionsChildren: 0,
      dietaryNotes: "",
      notes: "Vai confirmar após agenda de trabalho.",
      lastMessageStage: "save_the_date",
      updatedAt: new Date().toISOString()
    },
    {
      id: "guest-roberto",
      eventId: "demo-event-daniela-50",
      groupId: "grupo-convidados-especiais",
      fullName: "Roberto Oliveira",
      shortName: "Roberto",
      phone: "",
      token: "roberto-oliveira-dani50",
      status: "declined",
      invitedNames: ["Roberto Oliveira"],
      maxCompanionsAdults: 0,
      maxCompanionsChildren: 0,
      companionsAdults: 0,
      companionsChildren: 0,
      dietaryNotes: "",
      notes: "Agradeceu o convite, mas estará viajando.",
      lastMessageStage: "convite_oficial",
      updatedAt: new Date().toISOString()
    },
    {
      id: "guest-patricia",
      eventId: "demo-event-daniela-50",
      groupId: "grupo-amigos",
      fullName: "Patrícia Souza",
      shortName: "Patrícia",
      phone: "",
      token: "patricia-souza-dani50",
      status: "save_date_sent",
      invitedNames: ["Patrícia Souza"],
      maxCompanionsAdults: 1,
      maxCompanionsChildren: 1,
      companionsAdults: 0,
      companionsChildren: 0,
      dietaryNotes: "",
      notes: "Precisa receber convite oficial.",
      lastMessageStage: "save_the_date",
      updatedAt: new Date().toISOString()
    }
  ],
  messageTemplates: [
    {
      id: "msg-save-the-date",
      eventId: "demo-event-daniela-50",
      stage: "save_the_date",
      audience: "todos",
      title: "Save the date carinhoso",
      body: `Oi, {{nome}}! Tudo bem? Estamos preparando uma celebração muito especial: os 50 anos da Dani. 💛

A ideia é uma tarde tropical, leve e cheia de carinho no dia {{data}}, das {{horario}}.

Ainda vamos mandar o convite oficial, mas já queríamos pedir para você reservar essa data. {{segredo}}`
    },
    {
      id: "msg-convite-oficial",
      eventId: "demo-event-daniela-50",
      stage: "convite_oficial",
      audience: "todos",
      title: "Convite oficial com link",
      body: `Oi, {{nome}}! Seu convite para os 50 anos da Dani está separado com muito carinho. 🌺

Este convite está em nome de: {{convidados}}.

Será no dia {{data}}, das {{horario}}, na {{local}}. A banda {{banda}} toca das 13h30 às 16h30.

Para nos ajudar na organização do buffet e das lembrancinhas, confirme por aqui: {{link}}

{{segredo}}`
    },
    {
      id: "msg-lembrete-pendente",
      eventId: "demo-event-daniela-50",
      stage: "lembrete_pendente",
      audience: "pendentes",
      title: "Lembrete elegante para pendentes",
      body: `Oi, {{nome}}! Passando só para lembrar com carinho do convite dos 50 anos da Dani. 💚

Sua confirmação ajuda bastante na organização do buffet, mesas e lembrancinhas. Pode responder pelo link: {{link}}

Sem pressão, é só para conseguirmos organizar tudo com cuidado. {{segredo}}`
    },
    {
      id: "msg-final-confirmados",
      eventId: "demo-event-daniela-50",
      stage: "orientacao_final",
      audience: "confirmados",
      title: "Orientação final para confirmados",
      body: `Oi, {{nome}}! Está chegando o dia da celebração da Dani. 🌿

Será das {{horario}}, na {{local}}. A banda começa às 13h30.

Estamos felizes demais com sua presença. {{segredo}}`
    }
  ],
  tasks: [
    { id: "task-1", eventId: "demo-event-daniela-50", title: "Importar lista real de convidados", category: "convidados", status: "pending", dueDate: "2026-08-01" },
    { id: "task-2", eventId: "demo-event-daniela-50", title: "Enviar save the date para grupos prioritários", category: "mensagens", status: "pending", dueDate: "2026-08-15" },
    { id: "task-3", eventId: "demo-event-daniela-50", title: "Validar endereço completo e referência de chegada", category: "evento", status: "pending", dueDate: "2026-10-01" },
    { id: "task-4", eventId: "demo-event-daniela-50", title: "Fechar estimativa final com buffet", category: "buffet", status: "pending", dueDate: "2026-12-05" }
  ],
  memories: [
    {
      id: "memory-1",
      eventId: "demo-event-daniela-50",
      guestId: "guest-marcos",
      guestName: "Marcos",
      message: "A Dani sempre transforma encontro simples em festa. Vai ser lindo celebrar esse dia.",
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ],
  sales: [
    { id: "sale-1", name: "Daniela 50", stage: "Cliente fundador", nextStep: "Validar lista de convidados", owner: "Automação Extrema" },
    { id: "sale-2", name: "Bodas família teste", stage: "Diagnóstico", nextStep: "Levantar público e dor", owner: "Presença Querida" }
  ],
  contracts: [
    { id: "contract-1", clientName: "Daniela Mattano da Silva", plan: "Memorável fundador", status: "Em implantação", monthlyValue: "Piloto" }
  ]
};

export const menuImages = [
  "/cardapio/jm-festas/cardapio-01.jpeg",
  "/cardapio/jm-festas/cardapio-02.jpeg",
  "/cardapio/jm-festas/cardapio-03.jpeg",
  "/cardapio/jm-festas/cardapio-04.jpeg",
  "/cardapio/jm-festas/cardapio-05.jpeg",
  "/cardapio/jm-festas/cardapio-06.jpeg",
  "/cardapio/jm-festas/cardapio-07.jpeg",
  "/cardapio/jm-festas/cardapio-08.jpeg",
  "/cardapio/jm-festas/cardapio-09.jpeg",
  "/cardapio/jm-festas/cardapio-10.jpeg",
  "/cardapio/jm-festas/cardapio-11.jpeg"
];
