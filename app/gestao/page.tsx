"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { renderMessage } from "@/lib/messages";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { normalizePhoneForWhatsApp, statusLabels, statusTone } from "@/lib/status";
import type { AcquisitionPlan, ClientItem, EventBundle, Guest, GuestStatus, MessageTemplate, Profile, PromotionItem, SiteSettings, LeadDiagnostic } from "@/lib/types";

type Filter = GuestStatus | "all";

type ClientForm = {
  name: string;
  email: string;
  phone: string;
  planSlug: string;
  eventSlug: string;
  eventTitle: string;
  honoreeFullName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  theme: string;
};

type PlanForm = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  idealFor: string;
  referencePrice: string;
  founderPrice: string;
  founderSlotsTotal: string;
  founderSlotsUsed: string;
  sortOrder: string;
  features: string;
  ctaLabel: string;
};

type SettingsForm = SiteSettings;

const emptyClientForm: ClientForm = {
  name: "",
  email: "",
  phone: "",
  planSlug: "memoravel",
  eventSlug: "",
  eventTitle: "",
  honoreeFullName: "",
  eventDate: "",
  startTime: "19:00",
  endTime: "23:00",
  locationName: "",
  theme: ""
};

const emptyPlanForm: PlanForm = {
  slug: "",
  name: "",
  tag: "",
  description: "",
  idealFor: "",
  referencePrice: "",
  founderPrice: "Sem custo",
  founderSlotsTotal: "5",
  founderSlotsUsed: "0",
  sortOrder: "50",
  features: "",
  ctaLabel: "Quero ser cliente fundador"
};

const emptySettingsForm: SettingsForm = {
  solutionName: "Presença Querida",
  solutionDescription: "Gestão afetiva de presença para transformar confirmações em tranquilidade, carinho e memória.",
  aeSiteUrl: "https://automacaoextrema.com",
  whatsappNumber: "5519989848246",
  instagramUrl: "https://www.instagram.com/automacaoextrema",
  facebookUrl: "https://www.facebook.com/automacaoextrema",
  tiktokUrl: "https://www.tiktok.com/@automacaoextrema",
  youtubeUrl: "https://www.youtube.com/@automacaoextrema",
  footerNote: "Convites, presença e memória com cuidado."
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} demorou demais para responder.`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function GestaoPage() {
  const [bundle, setBundle] = useState<EventBundle | null>(null);
  const [plans, setPlans] = useState<AcquisitionPlan[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [leads, setLeads] = useState<LeadDiagnostic[]>([]);
  const [settingsForm, setSettingsForm] = useState<SettingsForm>(emptySettingsForm);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [clientForm, setClientForm] = useState<ClientForm>(emptyClientForm);
  const [planForm, setPlanForm] = useState<PlanForm>(emptyPlanForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdAccess, setCreatedAccess] = useState<{ email: string; password: string; resetLink: string } | null>(null);

  async function getAccessHeaders(): Promise<Record<string, string>> {
    const supabase = getSupabaseBrowser();
    if (!supabase) return {};
    const { data } = await withTimeout(supabase.auth.getSession(), 8000, "Leitura da sessão");
    return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
  }

  async function loadManagementData() {
    const headers = await getAccessHeaders();
    const [eventResponse, plansResponse, clientsResponse, leadsResponse, settingsResponse] = await Promise.all([
      fetchWithTimeout("/api/admin/daniela-50", { headers }, 12000),
      fetchWithTimeout("/api/management/plans", { headers }, 12000),
      fetchWithTimeout("/api/management/clients", { headers }, 12000),
      fetchWithTimeout("/api/management/leads", { headers }, 12000),
      fetchWithTimeout("/api/management/settings", { headers }, 12000)
    ]);

    if (eventResponse.ok) {
      const data = (await eventResponse.json()) as EventBundle;
      setBundle(data);
      setSelectedGuestId((current) => current || data.guests[0]?.id || "");
      setSelectedTemplateId((current) => current || data.messageTemplates[0]?.id || "");
    }

    if (plansResponse.ok) {
      const data = (await plansResponse.json()) as { plans: AcquisitionPlan[]; promotions: PromotionItem[] };
      setPlans(data.plans || []);
      setPromotions(data.promotions || []);
      setClientForm((current) => ({ ...current, planSlug: current.planSlug || data.plans?.[0]?.slug || "" }));
    }

    if (clientsResponse.ok) {
      const data = (await clientsResponse.json()) as { clients: ClientItem[] };
      setClients(data.clients || []);
    }

    if (leadsResponse.ok) {
      const data = (await leadsResponse.json()) as { leads: LeadDiagnostic[] };
      setLeads(data.leads || []);
    }

    if (settingsResponse.ok) {
      const data = (await settingsResponse.json()) as { settings: SiteSettings };
      setSettingsForm(data.settings || emptySettingsForm);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const supabase = getSupabaseBrowser();
        if (!supabase) {
          if (!cancelled) setAuthChecked(true);
          await loadManagementData();
          return;
        }

        const { data } = await withTimeout(supabase.auth.getSession(), 8000, "Leitura da sessão");
        const token = data.session?.access_token;
        if (!token) {
          if (!cancelled) {
            setProfile(null);
            setError("Acesse com o e-mail de gestão para liberar esta área.");
            setAuthChecked(true);
          }
          return;
        }

        const response = await fetchWithTimeout("/api/me/profile", { headers: { Authorization: `Bearer ${token}` } }, 12000);
        const loadedProfile = response.ok ? ((await response.json()) as Profile) : null;
        if (!loadedProfile) {
          const data = await response.json().catch(() => null);
          if (!cancelled) {
            setProfile(null);
            setError(data?.error || "Login encontrado, mas não foi possível carregar o perfil de gestão.");
            setAuthChecked(true);
          }
          return;
        }

        if (!cancelled) setProfile(loadedProfile);
        if (loadedProfile.role !== "gestao") {
          if (!cancelled) {
            setError("Este login não tem perfil de gestão.");
            setAuthChecked(true);
          }
          return;
        }

        await loadManagementData();
        if (!cancelled) setAuthChecked(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao validar acesso da gestão.");
          setAuthChecked(true);
        }
      }
    }
    boot();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const guests = bundle?.guests ?? [];
    const confirmedGuests = guests.filter((guest) => guest.status === "confirmed");
    return {
      clients: clients.length,
      plans: plans.length,
      guests: guests.length,
      confirmed: confirmedGuests.length,
      pending: guests.filter((guest) => ["pending", "save_date_sent", "invited"].includes(guest.status)).length,
      people: confirmedGuests.reduce((sum, guest) => sum + guest.companionsAdults + guest.companionsChildren, 0)
    };
  }, [bundle, clients.length, plans.length]);

  const filteredGuests = useMemo(() => {
    const guests = bundle?.guests ?? [];
    return filter === "all" ? guests : guests.filter((guest) => guest.status === filter);
  }, [bundle, filter]);

  const selectedGuest = bundle?.guests.find((guest) => guest.id === selectedGuestId) ?? null;
  const selectedTemplate = bundle?.messageTemplates.find((template) => template.id === selectedTemplateId) ?? null;
  const renderedMessage = bundle && selectedGuest && selectedTemplate
    ? renderMessage(selectedTemplate, bundle.event, selectedGuest, typeof window !== "undefined" ? window.location.origin : undefined)
    : "";

  function openWhatsApp(guest: Guest, template: MessageTemplate) {
    const phone = normalizePhoneForWhatsApp(guest.phone);
    const text = renderMessage(template, bundle!.event, guest, window.location.origin);
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function createClient(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    setCreatedAccess(null);

    const eventSlug = clientForm.eventSlug || slugify(clientForm.eventTitle || clientForm.honoreeFullName);
    const headers = await getAccessHeaders();
    const response = await fetch("/api/management/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ ...clientForm, eventSlug })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Não foi possível cadastrar o cliente.");
      return;
    }
    setMessage(data.inviteMessage || "Cliente cadastrado com sucesso.");
    setCreatedAccess({ email: clientForm.email, password: data.temporaryPassword || "", resetLink: data.resetLink || "/recuperar-senha" });
    setClientForm(emptyClientForm);
    await loadManagementData();
  }

  async function savePlan(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    const headers = await getAccessHeaders();
    const response = await fetch("/api/management/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ action: "save_plan", ...planForm, slug: planForm.slug || slugify(planForm.name) })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Não foi possível salvar o plano.");
      return;
    }
    setMessage("Plano salvo e disponível para a landing.");
    setPlanForm(emptyPlanForm);
    await loadManagementData();
  }

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    const headers = await getAccessHeaders();
    const response = await fetch("/api/management/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(settingsForm)
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || "Não foi possível salvar as configurações.");
      return;
    }
    setSettingsForm(data.settings || settingsForm);
    setMessage("Configurações do rodapé e redes sociais salvas.");
  }

  async function approveMemory(id: string, approved: boolean) {
    const headers = await getAccessHeaders();
    const response = await fetch("/api/admin/daniela-50", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ action: "approve_memory", id, isApproved: approved })
    });
    if (!response.ok) {
      setError("Não foi possível atualizar o depoimento.");
      return;
    }
    setMessage("Depoimento atualizado.");
    await loadManagementData();
  }

  if (!authChecked) return <div className="pageShell"><section className="panel">Validando acesso da gestão...</section></div>;

  if (getSupabaseBrowser() && (!profile || profile.role !== "gestao")) {
    return (
      <div className="pageShell">
        <section className="panel authPanel">
          <span className="kicker">Área gestão</span>
          <h1>Acesso protegido.</h1>
          <p>Entre com o usuário de gestão do Presença Querida para cadastrar clientes, planos, promoções e acompanhar a operação.</p>
          <div className="actions">
            <Link className="btn btnPrimary" href="/login">Entrar como gestão</Link>
          </div>
          {profile?.role === "cliente" ? <div className="notice danger"><strong>Este login é de cliente e não libera a gestão.</strong></div> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="pageShell">
      <section className="sectionBlock managementHero singleColumnHero">
        <div>
          <span className="kicker">Gestão Presença Querida</span>
          <h1>Cadastre clientes, planos, promoções e acompanhe a operação.</h1>
          <p className="lead">A gestão cria o cliente com perfil correto, vincula o evento e entrega um acesso seguro para troca de senha no primeiro acesso.</p>
        </div>
      </section>

      {error ? <div className="notice danger"><strong>{error}</strong></div> : null}
      {message ? <div className="notice success"><strong>{message}</strong></div> : null}
      {createdAccess ? (
        <div className="notice">
          <strong>Acesso do cliente criado.</strong>
          <p>E-mail: {createdAccess.email}</p>
          {createdAccess.password ? <p>Senha temporária: <code>{createdAccess.password}</code></p> : null}
          <p>Link para troca/definição de senha: <a href={createdAccess.resetLink} target="_blank" rel="noreferrer">{createdAccess.resetLink}</a></p>
          <p>Envie estas informações pelo e-mail/WhatsApp do relacionamento. Depois do primeiro acesso, o cliente deve trocar a senha.</p>
        </div>
      ) : null}

      <section className="metricGrid compactMetrics">
        <MetricCard label="Clientes" value={summary.clients} helper="Cadastrados na gestão" />
        <MetricCard label="Planos" value={summary.plans} helper="Ativos ou configurados" />
        <MetricCard label="Convites demo" value={summary.guests} helper="Evento Daniela 50" />
        <MetricCard label="Confirmados" value={summary.confirmed} helper={`${summary.people} pessoas previstas`} />
      </section>

      <section className="sectionBlock twoColumns">
        <article className="panel">
          <span className="kicker">Novo cliente</span>
          <h2>Criar cliente, evento e login</h2>
          <form className="formGrid" onSubmit={createClient}>
            <input placeholder="Nome do cliente" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} required />
            <div className="twoMini">
              <input type="email" placeholder="E-mail de acesso" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} required />
              <input placeholder="WhatsApp" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} />
            </div>
            <div className="twoMini">
              <select value={clientForm.planSlug} onChange={(e) => setClientForm({ ...clientForm, planSlug: e.target.value })}>
                {plans.map((plan) => <option key={plan.slug} value={plan.slug}>{plan.name}</option>)}
              </select>
              <input placeholder="Slug do evento. Ex.: daniela-50" value={clientForm.eventSlug} onChange={(e) => setClientForm({ ...clientForm, eventSlug: e.target.value })} />
            </div>
            <input placeholder="Título do evento. Ex.: Dani 50" value={clientForm.eventTitle} onChange={(e) => setClientForm({ ...clientForm, eventTitle: e.target.value })} required />
            <input placeholder="Pessoa homenageada" value={clientForm.honoreeFullName} onChange={(e) => setClientForm({ ...clientForm, honoreeFullName: e.target.value })} required />
            <div className="threeMini">
              <input type="date" value={clientForm.eventDate} onChange={(e) => setClientForm({ ...clientForm, eventDate: e.target.value })} required />
              <input type="time" value={clientForm.startTime} onChange={(e) => setClientForm({ ...clientForm, startTime: e.target.value })} />
              <input type="time" value={clientForm.endTime} onChange={(e) => setClientForm({ ...clientForm, endTime: e.target.value })} />
            </div>
            <input placeholder="Local" value={clientForm.locationName} onChange={(e) => setClientForm({ ...clientForm, locationName: e.target.value })} />
            <textarea placeholder="Tema ou observações do evento" value={clientForm.theme} onChange={(e) => setClientForm({ ...clientForm, theme: e.target.value })} />
            <button className="btn btnPrimary" type="submit">Criar cliente e acesso</button>
          </form>
        </article>

        <article className="panel">
          <span className="kicker">Planos e promoções</span>
          <h2>Configurar plano de aquisição</h2>
          <form className="formGrid" onSubmit={savePlan}>
            <div className="twoMini">
              <input placeholder="Slug. Ex.: memoravel" value={planForm.slug} onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value })} />
              <input placeholder="Nome do plano" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} required />
            </div>
            <input placeholder="Etiqueta. Ex.: Mais carinho" value={planForm.tag} onChange={(e) => setPlanForm({ ...planForm, tag: e.target.value })} />
            <textarea placeholder="Descrição comercial" value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} />
            <input placeholder="Ideal para..." value={planForm.idealFor} onChange={(e) => setPlanForm({ ...planForm, idealFor: e.target.value })} />
            <div className="threeMini">
              <input placeholder="Valor ref. Ex.: R$ 1.197" value={planForm.referencePrice} onChange={(e) => setPlanForm({ ...planForm, referencePrice: e.target.value })} />
              <input placeholder="Preço fundador" value={planForm.founderPrice} onChange={(e) => setPlanForm({ ...planForm, founderPrice: e.target.value })} />
              <input type="number" placeholder="Ordem" value={planForm.sortOrder} onChange={(e) => setPlanForm({ ...planForm, sortOrder: e.target.value })} />
            </div>
            <div className="twoMini">
              <input type="number" placeholder="Vagas fundadoras" value={planForm.founderSlotsTotal} onChange={(e) => setPlanForm({ ...planForm, founderSlotsTotal: e.target.value })} />
              <input type="number" placeholder="Vagas usadas" value={planForm.founderSlotsUsed} onChange={(e) => setPlanForm({ ...planForm, founderSlotsUsed: e.target.value })} />
            </div>
            <textarea placeholder="Benefícios, um por linha" value={planForm.features} onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })} />
            <input placeholder="Texto do botão" value={planForm.ctaLabel} onChange={(e) => setPlanForm({ ...planForm, ctaLabel: e.target.value })} />
            <button className="btn btnSecondary" type="submit">Salvar plano</button>
          </form>
        </article>
      </section>

      <section className="sectionBlock twoColumns">
        <article className="panel">
          <span className="kicker">Clientes cadastrados</span>
          <h2>Acessos criados pela gestão</h2>
          <div className="stack">
            {clients.length ? clients.map((client) => (
              <div className="listCard" key={client.id}>
                <strong>{client.name}</strong>
                <span>{client.email} · {client.status}</span>
                <p>Plano: {client.planSlug || "a definir"} · Evento: {client.eventSlug || "sem evento"}</p>
              </div>
            )) : <p>Nenhum cliente cadastrado ainda.</p>}
          </div>
        </article>
        <article className="panel">
          <span className="kicker">Planos ativos</span>
          <h2>O que aparece na landing</h2>
          <div className="stack">
            {plans.map((plan) => (
              <div className="listCard" key={plan.id}>
                <strong>{plan.name}</strong>
                <span>{plan.referencePrice} → {plan.founderPrice}</span>
                <p>{Math.max(plan.founderSlotsTotal - plan.founderSlotsUsed, 0)} vaga(s) fundadoras disponíveis.</p>
              </div>
            ))}
            {promotions.map((promo) => (
              <div className="listCard" key={promo.id}>
                <strong>{promo.title}</strong>
                <span>{promo.planSlug || "Todos os planos"}</span>
                <p>{promo.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="sectionBlock twoColumns">
        <article className="panel">
          <span className="kicker">Leads do diagnóstico</span>
          <h2>Entradas vindas da landing e WhatsApp</h2>
          <div className="stack">
            {leads.length ? leads.map((lead) => (
              <div className="listCard" key={lead.id}>
                <strong>{lead.name}</strong>
                <span>{lead.whatsapp} · {lead.eventType} · {lead.interestPlan}</span>
                <p>{lead.guestCount} · {lead.hasGuestList} · {lead.urgency}</p>
                {lead.notes ? <p>{lead.notes}</p> : null}
              </div>
            )) : <p>Nenhum diagnóstico recebido ainda.</p>}
          </div>
        </article>

        <article className="panel">
          <span className="kicker">Rodapé e redes sociais</span>
          <h2>Configurações públicas</h2>
          <form className="formGrid" onSubmit={saveSettings}>
            <input placeholder="Nome da solução" value={settingsForm.solutionName} onChange={(e) => setSettingsForm({ ...settingsForm, solutionName: e.target.value })} />
            <textarea placeholder="Descrição da solução no rodapé" value={settingsForm.solutionDescription} onChange={(e) => setSettingsForm({ ...settingsForm, solutionDescription: e.target.value })} />
            <input placeholder="Site da Automação Extrema" value={settingsForm.aeSiteUrl} onChange={(e) => setSettingsForm({ ...settingsForm, aeSiteUrl: e.target.value })} />
            <input placeholder="WhatsApp somente números. Ex.: 5519989848246" value={settingsForm.whatsappNumber} onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} />
            <div className="twoMini">
              <input placeholder="Instagram" value={settingsForm.instagramUrl} onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })} />
              <input placeholder="Facebook" value={settingsForm.facebookUrl} onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })} />
            </div>
            <div className="twoMini">
              <input placeholder="TikTok" value={settingsForm.tiktokUrl} onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })} />
              <input placeholder="YouTube" value={settingsForm.youtubeUrl} onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })} />
            </div>
            <input placeholder="Frase final do rodapé" value={settingsForm.footerNote} onChange={(e) => setSettingsForm({ ...settingsForm, footerNote: e.target.value })} />
            <button className="btn btnSecondary" type="submit">Salvar rodapé</button>
          </form>
        </article>
      </section>

      {bundle ? (
        <>
          <section className="sectionBlock">
            <span className="kicker">Mensagens WhatsApp</span>
            <h2>Gerar texto por convidado e fase</h2>
            <div className="panel formGrid">
              <div className="twoMini">
                <select value={selectedGuestId} onChange={(event) => setSelectedGuestId(event.target.value)}>
                  {bundle.guests.map((guest) => <option key={guest.id} value={guest.id}>{guest.fullName}</option>)}
                </select>
                <select value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}>
                  {bundle.messageTemplates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
                </select>
              </div>
              <div className="messageBox">{renderedMessage}</div>
              <div className="actions">
                {selectedGuest && selectedTemplate ? <button className="btn btnPrimary" type="button" onClick={() => openWhatsApp(selectedGuest, selectedTemplate)}>Fale no WhatsApp</button> : null}
                <a className="btn btnSecondary" href="/modelos/convidados-modelo.csv" download>Baixar modelo CSV</a>
              </div>
            </div>
          </section>

          <section className="sectionBlock">
            <span className="kicker">Operação do cliente</span>
            <h2>Convidados e status</h2>
            <div className="filterBar">
              {(["all", "pending", "save_date_sent", "invited", "confirmed", "maybe", "declined"] as Filter[]).map((item) => (
                <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "all" ? "Todos" : statusLabels[item]}</button>
              ))}
            </div>
            <div className="tableWrap">
              <table>
                <thead><tr><th>Convidado</th><th>Invite</th><th>Status</th><th>Link</th><th>WhatsApp</th></tr></thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td><strong>{guest.fullName}</strong><br /><small>{guest.notes}</small></td>
                      <td>{guest.invitedNames.join(", ")}</td>
                      <td><span className={`statusPill ${statusTone[guest.status]}`}>{statusLabels[guest.status]}</span></td>
                      <td><Link href={`/convite/${guest.token}`}>/convite/{guest.token}</Link></td>
                      <td>{guest.phone || "Sem número"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sectionBlock">
            <span className="kicker">Pós-evento e mural</span>
            <h2>Depoimentos enviados pelos convidados</h2>
            <div className="grid">
              {bundle.memories.map((item) => (
                <article className="card" key={item.id}>
                  <h3>{item.guestName}</h3>
                  <p>{item.message}</p>
                  <span className={`statusPill ${item.isApproved ? "tone-success" : "tone-warning"}`}>{item.isApproved ? "Aprovado" : "Aguardando aprovação"}</span>
                  <div className="actions">
                    <button className="btn btnSecondary" type="button" onClick={() => approveMemory(item.id, !item.isApproved)}>{item.isApproved ? "Ocultar" : "Aprovar"}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
