import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Card, DataTable, GlassPanel, Input, SectionLabel, Select, SiteBackground, TableToolbar, Tag, Textarea } from 'auralith-ui'

type Language = 'pt' | 'en'
type ThemeMode = 'dark' | 'light' | 'system'
type Period = '7d' | '30d' | '90d'
type Segment = 'all' | 'smb' | 'mid' | 'enterprise'
type Lifecycle = 'all' | 'trial' | 'active' | 'at-risk'
type FormStatus = { type: 'idle' | 'success' | 'error'; message: string }

type ProjectRow = {
  account: string
  lifecycle: Exclude<Lifecycle, 'all'>
  segment: Exclude<Segment, 'all'>
  mrr: string
  owner: string
  renewal: string
  health: 'healthy' | 'watch' | 'critical'
}

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || ''
const formSubmitToken = import.meta.env.VITE_FORMSUBMIT_TOKEN?.trim()
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const supabaseContactFunction = import.meta.env.VITE_SUPABASE_CONTACT_FUNCTION?.trim() || 'contact-lead'

const content = {
  pt: {
    app: '__APP_NAME__',
    header: {
      title: 'Cockpit operacional para escalar receita com previsibilidade',
      subtitle: 'Template com filtros de decisao, visao de risco e contato tecnico integrado ao fluxo de leads.',
    },
    language: 'Idioma',
    theme: 'Tema',
    themes: { dark: 'Escuro', light: 'Claro', system: 'Sistema' },
    context: {
      workspace: 'Workspace: Revenue Ops',
      sync: 'Sync: ha 2 min',
      env: 'Env: production',
    },
    metrics: {
      labels: {
        mrr: 'MRR total',
        churn: 'Churn mensal',
        activation: 'Ativacao onboarding',
        nps: 'NPS operacional',
      },
      period: {
        '7d': { mrr: 'R$ 286k', churn: '1.2%', activation: '71%', nps: '54' },
        '30d': { mrr: 'R$ 1.18M', churn: '1.8%', activation: '68%', nps: '49' },
        '90d': { mrr: 'R$ 3.42M', churn: '2.1%', activation: '65%', nps: '46' },
      },
    },
    filters: {
      period: 'Periodo',
      segment: 'Segmento',
      lifecycle: 'Status da conta',
      periodOptions: {
        '7d': { label: '7 dias', description: 'Visao curta para operacao diaria' },
        '30d': { label: '30 dias', description: 'Analise mensal para planejamento' },
        '90d': { label: '90 dias', description: 'Tendencia trimestral de receita' },
      },
      segmentOptions: {
        all: { label: 'Todos', description: 'SMB, Mid e Enterprise' },
        smb: { label: 'SMB', description: 'Times ate 50 usuarios' },
        mid: { label: 'Mid-Market', description: 'Operacao em crescimento' },
        enterprise: { label: 'Enterprise', description: 'Contas com governanca forte' },
      },
      lifecycleOptions: {
        all: { label: 'Todos', description: 'Qualquer fase de ciclo' },
        trial: { label: 'Trial', description: 'Contas em ativacao inicial' },
        active: { label: 'Active', description: 'Contas com receita recorrente' },
        'at-risk': { label: 'At risk', description: 'Contas com sinais de risco' },
      },
    },
    segments: {
      smb: 'SMB',
      mid: 'Mid-Market',
      enterprise: 'Enterprise',
    },
    lifecycle: {
      trial: 'Trial',
      active: 'Active',
      'at-risk': 'At risk',
    },
    table: {
      section: 'pipeline de projetos',
      title: 'Contas com receita, risco e previsao de renovacao',
      search: 'Buscar conta, owner ou segmento...',
      cta: 'Criar playbook',
      columns: {
        account: 'Conta',
        segment: 'Segmento',
        lifecycle: 'Status',
        mrr: 'MRR',
        owner: 'Owner',
        renewal: 'Renovacao',
      },
      empty: 'Nenhuma conta para esse recorte. Ajuste os filtros.',
    },
    contact: {
      section: 'suporte',
      title: 'Abrir chamado tecnico direto do dashboard',
      idle: 'Preencha os campos para criar um chamado.',
      sending: 'Enviando chamado...',
      success: 'Chamado enviado com sucesso.',
      error: 'Falha ao enviar chamado. Tente novamente.',
      missing: 'Configure VITE_CONTACT_EMAIL ou variaveis Supabase.',
      labels: { name: 'Nome', email: 'Email', phone: 'Telefone', subject: 'Assunto', message: 'Mensagem' },
      submit: 'Enviar chamado',
      submitting: 'Enviando...',
    },
  },
  en: {
    app: '__APP_NAME__',
    header: {
      title: 'Operational cockpit to scale revenue with predictability',
      subtitle: 'Template with decision filters, risk visibility, and support contact integrated with lead flow.',
    },
    language: 'Language',
    theme: 'Theme',
    themes: { dark: 'Dark', light: 'Light', system: 'System' },
    context: {
      workspace: 'Workspace: Revenue Ops',
      sync: 'Sync: 2 min ago',
      env: 'Env: production',
    },
    metrics: {
      labels: {
        mrr: 'Total MRR',
        churn: 'Monthly churn',
        activation: 'Onboarding activation',
        nps: 'Operational NPS',
      },
      period: {
        '7d': { mrr: '$ 58k', churn: '1.2%', activation: '71%', nps: '54' },
        '30d': { mrr: '$ 241k', churn: '1.8%', activation: '68%', nps: '49' },
        '90d': { mrr: '$ 698k', churn: '2.1%', activation: '65%', nps: '46' },
      },
    },
    filters: {
      period: 'Period',
      segment: 'Segment',
      lifecycle: 'Account status',
      periodOptions: {
        '7d': { label: '7 days', description: 'Short horizon for daily ops' },
        '30d': { label: '30 days', description: 'Monthly planning overview' },
        '90d': { label: '90 days', description: 'Quarterly revenue trend' },
      },
      segmentOptions: {
        all: { label: 'All', description: 'SMB, Mid, and Enterprise' },
        smb: { label: 'SMB', description: 'Teams up to 50 users' },
        mid: { label: 'Mid-Market', description: 'Growing operations' },
        enterprise: { label: 'Enterprise', description: 'High-governance accounts' },
      },
      lifecycleOptions: {
        all: { label: 'All', description: 'Any lifecycle stage' },
        trial: { label: 'Trial', description: 'Accounts in early activation' },
        active: { label: 'Active', description: 'Recurring revenue accounts' },
        'at-risk': { label: 'At risk', description: 'Accounts showing risk signals' },
      },
    },
    segments: {
      smb: 'SMB',
      mid: 'Mid-Market',
      enterprise: 'Enterprise',
    },
    lifecycle: {
      trial: 'Trial',
      active: 'Active',
      'at-risk': 'At risk',
    },
    table: {
      section: 'project pipeline',
      title: 'Accounts with revenue, risk, and renewal forecast',
      search: 'Search account, owner, or segment...',
      cta: 'Create playbook',
      columns: {
        account: 'Account',
        segment: 'Segment',
        lifecycle: 'Status',
        mrr: 'MRR',
        owner: 'Owner',
        renewal: 'Renewal',
      },
      empty: 'No account found for this filter set.',
    },
    contact: {
      section: 'support',
      title: 'Open a technical ticket from the dashboard',
      idle: 'Fill the fields to create a ticket.',
      sending: 'Sending ticket...',
      success: 'Ticket sent successfully.',
      error: 'Failed to send ticket. Please try again.',
      missing: 'Set VITE_CONTACT_EMAIL or Supabase variables.',
      labels: { name: 'Name', email: 'Email', phone: 'Phone', subject: 'Subject', message: 'Message' },
      submit: 'Send ticket',
      submitting: 'Sending...',
    },
  },
} as const

const baseRows: ProjectRow[] = [
  {
    account: 'Atlas Foods',
    lifecycle: 'active',
    segment: 'enterprise',
    mrr: '$ 31k',
    owner: 'Camila N.',
    renewal: '14 May',
    health: 'healthy',
  },
  {
    account: 'Northbeam AI',
    lifecycle: 'trial',
    segment: 'mid',
    mrr: '$ 7.8k',
    owner: 'Rafael P.',
    renewal: '28 May',
    health: 'watch',
  },
  {
    account: 'Prime Ledger',
    lifecycle: 'at-risk',
    segment: 'enterprise',
    mrr: '$ 42k',
    owner: 'Julia R.',
    renewal: '02 Jun',
    health: 'critical',
  },
  {
    account: 'Studio Loop',
    lifecycle: 'active',
    segment: 'smb',
    mrr: '$ 3.4k',
    owner: 'Mateus C.',
    renewal: '18 Jun',
    health: 'healthy',
  },
  {
    account: 'CloudPress',
    lifecycle: 'active',
    segment: 'mid',
    mrr: '$ 12.2k',
    owner: 'Sara V.',
    renewal: '25 Jun',
    health: 'watch',
  },
]

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
  const [period, setPeriod] = useState<Period>('30d')
  const [segment, setSegment] = useState<Segment>('all')
  const [lifecycle, setLifecycle] = useState<Lifecycle>('all')
  const [search, setSearch] = useState('')
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

  const rows = useMemo(() => {
    return baseRows.filter((row) => {
      const searchable = `${row.account} ${row.owner} ${row.segment}`.toLowerCase()
      const bySearch = searchable.includes(search.toLowerCase())
      const bySegment = segment === 'all' ? true : row.segment === segment
      const byLifecycle = lifecycle === 'all' ? true : row.lifecycle === lifecycle
      return bySearch && bySegment && byLifecycle
    })
  }, [lifecycle, search, segment])

  const metricValues = text.metrics.period[period]

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
        source: 'dashboard_template',
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
      if (!sentSupabase && !sentFormSubmit) throw new Error('submit-failed')
      form.reset()
      setStatus({ type: 'success', message: text.contact.success })
    } catch {
      setStatus({ type: 'error', message: text.contact.error })
    } finally {
      setIsSubmitting(false)
    }
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
          <SectionLabel>dashboard cockpit</SectionLabel>
          <h1>{text.header.title}</h1>
          <p>{text.header.subtitle}</p>
          <div className="context-strip">
            <Tag>{text.context.workspace}</Tag>
            <Tag>{text.context.sync}</Tag>
            <Tag>{text.context.env}</Tag>
          </div>
        </GlassPanel>

        <section className="metrics">
          <Card className="metric" variant="subtle">
            <SectionLabel>{text.metrics.labels.mrr}</SectionLabel>
            <strong>{metricValues.mrr}</strong>
          </Card>
          <Card className="metric" variant="subtle">
            <SectionLabel>{text.metrics.labels.churn}</SectionLabel>
            <strong>{metricValues.churn}</strong>
          </Card>
          <Card className="metric" variant="subtle">
            <SectionLabel>{text.metrics.labels.activation}</SectionLabel>
            <strong>{metricValues.activation}</strong>
          </Card>
          <Card className="metric" variant="subtle">
            <SectionLabel>{text.metrics.labels.nps}</SectionLabel>
            <strong>{metricValues.nps}</strong>
          </Card>
        </section>

        <section className="table-area">
          <SectionLabel>{text.table.section}</SectionLabel>
          <h2 className="section-title">{text.table.title}</h2>
          <div className="filter-grid">
            <Select label={text.filters.period} onValueChange={(value) => setPeriod(value as Period)} value={period}>
              <Select.Option description={text.filters.periodOptions['7d'].description} label={text.filters.periodOptions['7d'].label} value="7d" />
              <Select.Option description={text.filters.periodOptions['30d'].description} label={text.filters.periodOptions['30d'].label} value="30d" />
              <Select.Option description={text.filters.periodOptions['90d'].description} label={text.filters.periodOptions['90d'].label} value="90d" />
            </Select>
            <Select label={text.filters.segment} onValueChange={(value) => setSegment(value as Segment)} value={segment}>
              <Select.Option description={text.filters.segmentOptions.all.description} label={text.filters.segmentOptions.all.label} value="all" />
              <Select.Option description={text.filters.segmentOptions.smb.description} label={text.filters.segmentOptions.smb.label} value="smb" />
              <Select.Option description={text.filters.segmentOptions.mid.description} label={text.filters.segmentOptions.mid.label} value="mid" />
              <Select.Option description={text.filters.segmentOptions.enterprise.description} label={text.filters.segmentOptions.enterprise.label} value="enterprise" />
            </Select>
            <Select label={text.filters.lifecycle} onValueChange={(value) => setLifecycle(value as Lifecycle)} value={lifecycle}>
              <Select.Option description={text.filters.lifecycleOptions.all.description} label={text.filters.lifecycleOptions.all.label} value="all" />
              <Select.Option description={text.filters.lifecycleOptions.trial.description} label={text.filters.lifecycleOptions.trial.label} value="trial" />
              <Select.Option description={text.filters.lifecycleOptions.active.description} label={text.filters.lifecycleOptions.active.label} value="active" />
              <Select.Option description={text.filters.lifecycleOptions['at-risk'].description} label={text.filters.lifecycleOptions['at-risk'].label} value="at-risk" />
            </Select>
          </div>
          <TableToolbar
            onSearchValueChange={setSearch}
            primaryAction={<Button variant="secondary">{text.table.cta}</Button>}
            searchPlaceholder={text.table.search}
            searchValue={search}
          />
          <DataTable<ProjectRow>
            columns={[
              { key: 'account', header: text.table.columns.account },
              {
                key: 'segment',
                header: text.table.columns.segment,
                render: (row) => text.segments[row.segment],
              },
              {
                key: 'lifecycle',
                header: text.table.columns.lifecycle,
                render: (row) => (
                  <Tag className={`status-tag ${row.health}`}>{text.lifecycle[row.lifecycle]}</Tag>
                ),
              },
              { key: 'mrr', header: text.table.columns.mrr, align: 'right' },
              { key: 'owner', header: text.table.columns.owner },
              { key: 'renewal', header: text.table.columns.renewal, align: 'right' },
            ]}
            data={rows}
            empty={text.table.empty}
          />
        </section>

        <section className="contact">
          <GlassPanel className="contact-panel">
            <SectionLabel>{text.contact.section}</SectionLabel>
            <h2 className="section-title">{text.contact.title}</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              <input name="_subject" type="hidden" value="[Auralith Dashboard] New support ticket" />
              <input name="_captcha" type="hidden" value="false" />
              <input name="_template" type="hidden" value="table" />

              <div className="form-row">
                <Input label={text.contact.labels.name} name="name" required />
                <Input label={text.contact.labels.email} name="email" required type="email" />
              </div>

              <div className="form-row">
                <Input
                  label={text.contact.labels.phone}
                  name="phone"
                  onInput={(event) => {
                    const input = event.currentTarget
                    input.value = formatPhoneMask(input.value)
                  }}
                  pattern="\(\d{2}\)\s\d{4,5}-\d{4}"
                  required
                  type="tel"
                />
                <Input label={text.contact.labels.subject} name="subject" required />
              </div>

              <Textarea label={text.contact.labels.message} name="message" required rows={4} />

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
