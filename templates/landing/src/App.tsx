import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Card, GlassPanel, Input, SectionLabel, Select, SiteBackground, Tag, Textarea } from 'auralith-ui'

type Language = 'pt' | 'en'
type ThemeMode = 'dark' | 'light' | 'system'
type BillingCycle = 'monthly' | 'yearly'
type IntegrationFilter = 'all' | 'lead' | 'payments' | 'support'
type FormStatus = { type: 'idle' | 'success' | 'error'; message: string }

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || ''
const formSubmitToken = import.meta.env.VITE_FORMSUBMIT_TOKEN?.trim()
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const supabaseContactFunction = import.meta.env.VITE_SUPABASE_CONTACT_FUNCTION?.trim() || 'contact-lead'

const content = {
  pt: {
    app: '__APP_NAME__',
    hero: {
      title: 'Landing premium para produto digital em semanas, nao meses',
      description: 'Auralith Stack entrega base visual, captura de leads e deploy guiado para seu time focar em conversao e crescimento.',
      primary: 'Solicitar diagnostico',
      secondary: 'Ver stack em detalhes',
      trust: ['+240 leads/m', 'SLA de resposta 15min', 'Setup inicial em 1 dia'],
    },
    useCases: {
      label: 'casos de uso',
      title: 'Resultado visivel para marketing, produto e operacao',
      items: [
        {
          title: 'Landing de campanha com governanca de design',
          description: 'Padronize identidade visual e publique variações com baixo risco de regressao.',
          impact: 'Tempo de entrega: -42%',
        },
        {
          title: 'Motor de captura com trilha completa de contato',
          description: 'Leads chegam no Supabase e seguem com fallback por email para nao perder oportunidade.',
          impact: 'Taxa de perda: < 1%',
        },
        {
          title: 'Deploy sem friccao para time enxuto',
          description: 'Receitas prontas para Pages e Vercel com envs mapeadas para ambiente de producao.',
          impact: 'Primeiro release: < 30 min',
        },
      ],
    },
    plans: {
      label: 'planos',
      title: 'Selecione o ciclo e simule seu ROI de crescimento',
      cycle: 'Ciclo de cobranca',
      period: { monthly: 'Mensal', yearly: 'Anual (economia 20%)' },
      cards: [
        {
          name: 'Launch',
          description: 'Para lancar com consistencia e medir os primeiros sinais de conversao.',
          monthly: 'R$ 890',
          yearly: 'R$ 712',
          outcome: 'Ideal para validacao de oferta',
        },
        {
          name: 'Scale',
          description: 'Para operacoes com pipeline ativo e necessidade de iteracao semanal.',
          monthly: 'R$ 1.790',
          yearly: 'R$ 1.432',
          outcome: 'Melhor relacao entre velocidade e controle',
        },
        {
          name: 'Enterprise',
          description: 'Para times com multiplos squads, SLA e governanca de arquitetura.',
          monthly: 'Sob consulta',
          yearly: 'Sob consulta',
          outcome: 'Acompanhamento tecnico dedicado',
        },
      ],
    },
    integrations: {
      label: 'integracoes',
      title: 'Filtre por contexto e veja conectores prontos para uso',
      filterLabel: 'Tipo de integracao',
      filters: {
        all: { label: 'Todas', description: 'Visao completa dos conectores' },
        lead: { label: 'Lead capture', description: 'Entrada e qualificacao de contatos' },
        payments: { label: 'Pagamentos', description: 'Checkout e cobranca recorrente' },
        support: { label: 'Suporte', description: 'Atendimento e acompanhamento' },
      },
      items: [
        {
          name: 'Supabase Edge Function',
          category: 'lead',
          description: 'Recebe contatos com validacao e rastreabilidade por source.',
        },
        {
          name: 'FormSubmit Mirror',
          category: 'lead',
          description: 'Espelho/fallback para envio de contato por email.',
        },
        {
          name: 'Stripe Checkout',
          category: 'payments',
          description: 'Fluxo de compra e assinatura para planos recorrentes.',
        },
        {
          name: 'Mercado Pago',
          category: 'payments',
          description: 'Alternativa regional para boleto, pix e cartao.',
        },
        {
          name: 'HubSpot Inbox',
          category: 'support',
          description: 'Roteamento de atendimento e visao de historico comercial.',
        },
        {
          name: 'Linear / Jira',
          category: 'support',
          description: 'Abertura de incidentes para squads de engenharia.',
        },
      ],
    },
    contact: {
      label: 'contato',
      title: 'Ative seu projeto com um plano tecnico-comercial em 24 horas',
      idle: 'Preencha os campos para enviar sua mensagem.',
      sending: 'Enviando contato...',
      success: 'Mensagem enviada com sucesso.',
      error: 'Nao foi possivel enviar agora. Tente novamente.',
      missing: 'Configure VITE_CONTACT_EMAIL ou variaveis Supabase antes de enviar.',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      subject: 'Assunto',
      message: 'Mensagem',
      submit: 'Enviar mensagem',
      submitting: 'Enviando...',
    },
    language: 'Idioma',
    theme: 'Tema',
    themes: { dark: 'Escuro', light: 'Claro', system: 'Sistema' },
  },
  en: {
    app: '__APP_NAME__',
    hero: {
      title: 'Premium product landing shipped in weeks, not months',
      description: 'Auralith Stack provides visual foundations, lead capture, and deploy recipes so your team focuses on conversion and growth.',
      primary: 'Request diagnostics',
      secondary: 'Explore the stack',
      trust: ['+240 leads/mo', '15-min response SLA', 'Initial setup in 1 day'],
    },
    useCases: {
      label: 'use cases',
      title: 'Visible outcomes for marketing, product, and operations',
      items: [
        {
          title: 'Campaign landing with design governance',
          description: 'Standardize visual identity and publish variants with low regression risk.',
          impact: 'Delivery time: -42%',
        },
        {
          title: 'Lead engine with full contact traceability',
          description: 'Leads flow to Supabase with email mirror fallback to avoid losses.',
          impact: 'Lead loss rate: < 1%',
        },
        {
          title: 'Low-friction deploy for lean teams',
          description: 'Ready recipes for Pages and Vercel with environment variables mapped for production.',
          impact: 'First release: < 30 min',
        },
      ],
    },
    plans: {
      label: 'plans',
      title: 'Pick a billing cycle and estimate growth ROI',
      cycle: 'Billing cycle',
      period: { monthly: 'Monthly', yearly: 'Yearly (20% savings)' },
      cards: [
        {
          name: 'Launch',
          description: 'For launching with consistency and measuring first conversion signals.',
          monthly: '$179',
          yearly: '$143',
          outcome: 'Best for offer validation',
        },
        {
          name: 'Scale',
          description: 'For active pipelines with weekly iteration needs.',
          monthly: '$359',
          yearly: '$287',
          outcome: 'Best speed-to-control balance',
        },
        {
          name: 'Enterprise',
          description: 'For multi-squad teams with SLA and architecture governance.',
          monthly: 'Custom',
          yearly: 'Custom',
          outcome: 'Dedicated technical guidance',
        },
      ],
    },
    integrations: {
      label: 'integrations',
      title: 'Filter by context and review ready connectors',
      filterLabel: 'Integration type',
      filters: {
        all: { label: 'All', description: 'Full connector catalog' },
        lead: { label: 'Lead capture', description: 'Contact intake and qualification' },
        payments: { label: 'Payments', description: 'Checkout and recurring billing' },
        support: { label: 'Support', description: 'Service and follow-up operations' },
      },
      items: [
        {
          name: 'Supabase Edge Function',
          category: 'lead',
          description: 'Receives contacts with payload validation and source tracking.',
        },
        {
          name: 'FormSubmit Mirror',
          category: 'lead',
          description: 'Email mirror/fallback path for contact submissions.',
        },
        {
          name: 'Stripe Checkout',
          category: 'payments',
          description: 'Checkout and subscription flows for recurring plans.',
        },
        {
          name: 'Mercado Pago',
          category: 'payments',
          description: 'Regional option for card, boleto, and pix.',
        },
        {
          name: 'HubSpot Inbox',
          category: 'support',
          description: 'Support routing with commercial timeline context.',
        },
        {
          name: 'Linear / Jira',
          category: 'support',
          description: 'Incident and request handoff to engineering teams.',
        },
      ],
    },
    contact: {
      label: 'contact',
      title: 'Activate your project with a technical-commercial plan in 24 hours',
      idle: 'Fill out the fields to send your message.',
      sending: 'Sending contact...',
      success: 'Message sent successfully.',
      error: 'Unable to send right now. Please try again.',
      missing: 'Set VITE_CONTACT_EMAIL or Supabase variables before submitting.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send message',
      submitting: 'Sending...',
    },
    language: 'Language',
    theme: 'Theme',
    themes: { dark: 'Dark', light: 'Light', system: 'System' },
  },
} as const

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt'
  return window.navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem('auralith-theme-mode')
  if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  return 'dark'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const preferLight = window.matchMedia('(prefers-color-scheme: light)').matches
  if (mode === 'light' || (mode === 'system' && preferLight)) {
    root.setAttribute('data-theme', 'light')
    return
  }
  root.removeAttribute('data-theme')
}

function formatPhoneMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function App() {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage())
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialThemeMode())
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [integrationFilter, setIntegrationFilter] = useState<IntegrationFilter>('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const text = content[language]
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: text.contact.idle })

  useEffect(() => {
    setStatus((current) => (current.type === 'idle' ? { type: 'idle', message: text.contact.idle } : current))
  }, [text.contact.idle])

  useEffect(() => {
    window.localStorage.setItem('auralith-theme-mode', themeMode)
    applyTheme(themeMode)
    if (themeMode !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: light)')
    const update = () => applyTheme('system')
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [themeMode])

  const formSubmitEndpoint = useMemo(() => {
    if (formSubmitToken) return `https://formsubmit.co/ajax/${formSubmitToken}`
    if (contactEmail) return `https://formsubmit.co/ajax/${contactEmail}`
    return ''
  }, [])

  const filteredIntegrations = useMemo(() => {
    if (integrationFilter === 'all') return text.integrations.items
    return text.integrations.items.filter((item) => item.category === integrationFilter)
  }, [integrationFilter, text.integrations.items])

  async function submitViaSupabase(formData: FormData) {
    if (!supabaseUrl || !supabasePublishableKey) return false

    const response = await fetch(`${supabaseUrl}/functions/v1/${supabaseContactFunction}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabasePublishableKey}`,
        apikey: supabasePublishableKey,
      },
      body: JSON.stringify({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        subject: String(formData.get('subject') || ''),
        message: String(formData.get('message') || ''),
        source: 'landing_template',
      }),
    })

    return response.ok
  }

  async function submitViaFormSubmit(formData: FormData) {
    if (!formSubmitEndpoint) return false

    const response = await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })

    return response.ok
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formSubmitEndpoint && (!supabaseUrl || !supabasePublishableKey)) {
      setStatus({ type: 'error', message: text.contact.missing })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)
    setStatus({ type: 'idle', message: text.contact.sending })

    try {
      const sentSupabase = await submitViaSupabase(formData)
      const sentFormSubmit = formSubmitEndpoint ? await submitViaFormSubmit(formData) : false

      if (!sentSupabase && !sentFormSubmit) {
        throw new Error('submit-failed')
      }

      form.reset()
      setStatus({ type: 'success', message: text.contact.success })
    } catch {
      setStatus({ type: 'error', message: text.contact.error })
    } finally {
      setIsSubmitting(false)
    }
  }

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="page">
      <SiteBackground
        settings={{
          showDiffuse: true,
          showGrid: true,
          intensity: 'soft',
          gridStyle: 'orthogonal',
        }}
      />

      <div className="container">
        <GlassPanel className="topbar">
          <Tag>{text.app}</Tag>
          <div className="controls">
            <Select label={text.language} onValueChange={(value) => setLanguage(value === 'en' ? 'en' : 'pt')} value={language}>
              <Select.Option description="Portugues" label="PT" value="pt" />
              <Select.Option description="English" label="EN" value="en" />
            </Select>
            <Select
              label={text.theme}
              onValueChange={(value) => setThemeMode(value === 'light' || value === 'system' ? value : 'dark')}
              value={themeMode}
            >
              <Select.Option description="Night contrast" label={text.themes.dark} value="dark" />
              <Select.Option description="Neutral canvas" label={text.themes.light} value="light" />
              <Select.Option description="OS preference" label={text.themes.system} value="system" />
            </Select>
          </div>
        </GlassPanel>

        <GlassPanel className="hero">
          <h1>{text.hero.title}</h1>
          <p>{text.hero.description}</p>
          <div className="actions">
            <Button onClick={scrollToContact}>{text.hero.primary}</Button>
            <Button onClick={scrollToContact} variant="secondary">{text.hero.secondary}</Button>
          </div>
          <div className="trust-strip">
            {text.hero.trust.map((item) => (
              <Tag className="trust-tag" key={item}>{item}</Tag>
            ))}
          </div>
        </GlassPanel>

        <section className="grid">
          <SectionLabel>{text.useCases.label}</SectionLabel>
          <h2 className="section-title">{text.useCases.title}</h2>
          <div className="cards">
            {text.useCases.items.map((item) => (
              <Card className="item" key={item.title} variant="subtle">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Tag className="impact-tag">{item.impact}</Tag>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid split-grid">
          <GlassPanel className="contact-panel plan-panel">
            <SectionLabel>{text.plans.label}</SectionLabel>
            <h2 className="section-title">{text.plans.title}</h2>
            <Select
              label={text.plans.cycle}
              onValueChange={(value) => setBillingCycle(value === 'yearly' ? 'yearly' : 'monthly')}
              value={billingCycle}
            >
              <Select.Option description="Pay month by month" label={text.plans.period.monthly} value="monthly" />
              <Select.Option description="Best cost efficiency" label={text.plans.period.yearly} value="yearly" />
            </Select>
            <div className="plan-cards">
              {text.plans.cards.map((plan) => (
                <Card className="plan-card" key={plan.name} variant="subtle">
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <strong>{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</strong>
                  <span>{plan.outcome}</span>
                </Card>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="contact-panel integrations-panel">
            <SectionLabel>{text.integrations.label}</SectionLabel>
            <h2 className="section-title">{text.integrations.title}</h2>
            <Select
              label={text.integrations.filterLabel}
              onValueChange={(value) => setIntegrationFilter(value as IntegrationFilter)}
              value={integrationFilter}
            >
              <Select.Option
                description={text.integrations.filters.all.description}
                label={text.integrations.filters.all.label}
                value="all"
              />
              <Select.Option
                description={text.integrations.filters.lead.description}
                label={text.integrations.filters.lead.label}
                value="lead"
              />
              <Select.Option
                description={text.integrations.filters.payments.description}
                label={text.integrations.filters.payments.label}
                value="payments"
              />
              <Select.Option
                description={text.integrations.filters.support.description}
                label={text.integrations.filters.support.label}
                value="support"
              />
            </Select>
            <div className="integration-list">
              {filteredIntegrations.map((item) => (
                <Card className="integration-item" key={item.name} variant="subtle">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </Card>
              ))}
            </div>
          </GlassPanel>
        </section>

        <section className="contact" id="contact">
          <GlassPanel className="contact-panel">
            <SectionLabel>{text.contact.label}</SectionLabel>
            <h2 className="section-title">{text.contact.title}</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input name="_subject" type="hidden" value="[Auralith Landing] New contact" />
              <input name="_captcha" type="hidden" value="false" />
              <input name="_template" type="hidden" value="table" />

              <div className="form-row">
                <Input.Root>
                  <Input.Label>{text.contact.name}</Input.Label>
                  <Input.Field name="name" required />
                </Input.Root>
                <Input.Root>
                  <Input.Label>{text.contact.email}</Input.Label>
                  <Input.Field name="email" required type="email" />
                </Input.Root>
              </div>

              <div className="form-row">
                <Input.Root>
                  <Input.Label>{text.contact.phone}</Input.Label>
                  <Input.Field
                    name="phone"
                    onInput={(event) => {
                      const input = event.currentTarget
                      input.value = formatPhoneMask(input.value)
                    }}
                    pattern="\(\d{2}\)\s\d{4,5}-\d{4}"
                    required
                    type="tel"
                  />
                </Input.Root>
                <Input.Root>
                  <Input.Label>{text.contact.subject}</Input.Label>
                  <Input.Field name="subject" required />
                </Input.Root>
              </div>

              <Textarea.Root>
                <Textarea.Label>{text.contact.message}</Textarea.Label>
                <Textarea.Field name="message" required rows={4} />
              </Textarea.Root>

              <div className="form-actions">
                <p className={status.type === 'success' ? 'status success' : status.type === 'error' ? 'status error' : 'status'}>{status.message}</p>
                <Button disabled={isSubmitting} type="submit">{isSubmitting ? text.contact.submitting : text.contact.submit}</Button>
              </div>
            </form>
          </GlassPanel>
        </section>
      </div>
    </main>
  )
}
