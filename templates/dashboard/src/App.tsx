import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { GlassPanel, SectionLabel, SiteBackground, Tag, ToastProvider, useToast } from 'auralith-ui'

import { Header } from './components/Header'
import { MetricsOverview } from './components/MetricsOverview'
import { ProjectsTable } from './components/ProjectsTable'
import { SupportWidget } from './components/SupportWidget'

import { baseRows, contactEmail, content, formSubmitToken, supabaseContactFunction, supabasePublishableKey, supabaseUrl } from './data'
import type { Language, Lifecycle, Period, Segment, ThemeMode } from './data'

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

export function AppContent() {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage())
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialThemeMode())
  const [period, setPeriod] = useState<Period>('30d')
  const [segment, setSegment] = useState<Segment>('all')
  const [lifecycle, setLifecycle] = useState<Lifecycle>('all')
  const [search, setSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const text = content[language]
  
  const toast = useToast()

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
      toast({ title: 'Aviso', description: text.contact.missing, variant: 'error' })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)
    toast({ title: 'Aviso', description: text.contact.sending })

    try {
      const sentSupabase = await submitViaSupabase(formData)
      const sentFormSubmit = formSubmitEndpoint ? await submitViaFormSubmit(formData) : false
      if (!sentSupabase && !sentFormSubmit) throw new Error('submit-failed')
      form.reset()
      toast({ title: 'Sucesso', description: text.contact.success, variant: 'success' })
    } catch {
      toast({ title: 'Erro', description: text.contact.error, variant: 'error' })
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

      <div className="container" style={{ paddingBottom: '3rem' }}>
        <Header 
          appName={text.app}
          text={text}
          language={language} setLanguage={setLanguage}
          themeMode={themeMode} setThemeMode={setThemeMode}
        />

        <GlassPanel className="hero">
          <SectionLabel>dashboard cockpit</SectionLabel>
          <h1>{text.header.title}</h1>
          <p>{text.header.subtitle}</p>
          <div className="context-strip" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Tag>{text.context.workspace}</Tag>
            <Tag>{text.context.sync}</Tag>
            <Tag>{text.context.env}</Tag>
          </div>
        </GlassPanel>

        <MetricsOverview text={text.metrics} metricValues={metricValues} />

        <ProjectsTable 
          text={text.table}
          period={period} setPeriod={setPeriod}
          segment={segment} setSegment={setSegment}
          lifecycle={lifecycle} setLifecycle={setLifecycle}
          search={search} setSearch={setSearch}
          rows={rows}
        />

        <SupportWidget text={text.contact} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </main>
  )
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
