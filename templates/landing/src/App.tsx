import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { SiteBackground, ToastProvider, useToast } from 'auralith-ui'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Pricing } from './components/Pricing'
import { Integrations } from './components/Integrations'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'

import { contactEmail, formSubmitToken, supabaseUrl, supabasePublishableKey, supabaseContactFunction, content } from './data'
import type { Language, ThemeMode, BillingCycle, IntegrationFilter } from './data'

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
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [integrationFilter, setIntegrationFilter] = useState<IntegrationFilter>('all')
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

  const filteredIntegrations = useMemo(() => {
    if (integrationFilter === 'all') return text.integrations.items
    return text.integrations.items.filter((item: any) => item.category === integrationFilter)
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

      if (!sentSupabase && !sentFormSubmit) {
        throw new Error('submit-failed')
      }

      form.reset()
      toast({ title: 'Sucesso', description: text.contact.success, variant: 'success' })
    } catch {
      toast({ title: 'Erro', description: text.contact.error, variant: 'error' })
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
        <Header 
          appName={text.app} 
          text={text} 
          language={language} setLanguage={setLanguage} 
          themeMode={themeMode} setThemeMode={setThemeMode} 
        />

        <Hero text={text.hero} onContactClick={scrollToContact} />

        <Features text={text.useCases} />

        <section className="grid split-grid">
          <Pricing text={text.plans} billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
          <Integrations text={text.integrations} filteredIntegrations={filteredIntegrations} integrationFilter={integrationFilter} setIntegrationFilter={setIntegrationFilter} />
        </section>

        <FAQ />

        <Contact text={text.contact} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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
