import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Card, DataTable, GlassPanel, Input, SectionLabel, SiteBackground, TableToolbar, Tag, Textarea } from 'auralith-ui'

type Language = 'pt' | 'en'
type ThemeMode = 'dark' | 'light' | 'system'
type FormStatus = { type: 'idle' | 'success' | 'error'; message: string }

type ProjectRow = {
  project: string
  status: string
  owner: string
  sla: string
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
      title: 'Painel operacional pronto para produto',
      subtitle: 'Template de dashboard com tabela, filtros e formulario de suporte conectado ao fluxo de leads.',
    },
    language: 'Idioma',
    theme: 'Tema',
    themes: { dark: 'Escuro', light: 'Claro', system: 'Sistema' },
    metrics: [
      ['leads ativos', '127'],
      ['conversao media', '8.4%'],
      ['tickets abertos', '12'],
      ['resolucao no prazo', '94%'],
    ],
    table: {
      section: 'pipeline de projetos',
      title: 'Visao rapida de operacao e SLA',
      search: 'Buscar projeto...',
      cta: 'Novo item',
      columns: { project: 'Projeto', status: 'Status', owner: 'Responsavel', sla: 'SLA' },
      empty: 'Nenhum projeto encontrado para este filtro.',
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
      title: 'Operational dashboard ready for product teams',
      subtitle: 'Dashboard template with table, filters, and support form wired to your lead flow.',
    },
    language: 'Language',
    theme: 'Theme',
    themes: { dark: 'Dark', light: 'Light', system: 'System' },
    metrics: [
      ['active leads', '127'],
      ['avg conversion', '8.4%'],
      ['open tickets', '12'],
      ['on-time resolution', '94%'],
    ],
    table: {
      section: 'project pipeline',
      title: 'Quick operational and SLA overview',
      search: 'Search project...',
      cta: 'New item',
      columns: { project: 'Project', status: 'Status', owner: 'Owner', sla: 'SLA' },
      empty: 'No project found for this filter.',
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
  { project: 'Auralith Landing', status: 'Active', owner: 'Team A', sla: '4h' },
  { project: 'Customer Dashboard', status: 'In Review', owner: 'Team B', sla: '8h' },
  { project: 'Analytics Hub', status: 'Paused', owner: 'Team C', sla: '24h' },
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

  const rows = useMemo(
    () => baseRows.filter((row) => `${row.project} ${row.owner} ${row.status}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

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
            <label>
              <span>{text.language}</span>
              <select onChange={(event) => setLanguage(event.target.value as Language)} value={language}>
                <option value="pt">PT</option>
                <option value="en">EN</option>
              </select>
            </label>
            <label>
              <span>{text.theme}</span>
              <select onChange={(event) => setThemeMode(event.target.value as ThemeMode)} value={themeMode}>
                <option value="dark">{text.themes.dark}</option>
                <option value="light">{text.themes.light}</option>
                <option value="system">{text.themes.system}</option>
              </select>
            </label>
          </div>
        </GlassPanel>

        <GlassPanel className="hero">
          <SectionLabel>dashboard template</SectionLabel>
          <h1>{text.header.title}</h1>
          <p>{text.header.subtitle}</p>
        </GlassPanel>

        <section className="metrics">
          {text.metrics.map((metric) => (
            <Card className="metric" key={metric[0]} variant="subtle">
              <SectionLabel>{metric[0]}</SectionLabel>
              <strong>{metric[1]}</strong>
            </Card>
          ))}
        </section>

        <section className="table-area">
          <SectionLabel>{text.table.section}</SectionLabel>
          <h2 className="section-title">{text.table.title}</h2>
          <TableToolbar
            onSearchValueChange={setSearch}
            primaryAction={<Button variant="secondary">{text.table.cta}</Button>}
            searchPlaceholder={text.table.search}
            searchValue={search}
          />
          <DataTable<ProjectRow>
            columns={[
              { key: 'project', header: text.table.columns.project },
              {
                key: 'status',
                header: text.table.columns.status,
                render: (row) => (
                  <Tag className="status-tag">{row.status}</Tag>
                ),
              },
              { key: 'owner', header: text.table.columns.owner },
              { key: 'sla', header: text.table.columns.sla, align: 'right' },
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
