import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Card, GlassPanel, Input, SectionLabel, SiteBackground, Tag, Textarea } from 'auralith-ui'

type Language = 'pt' | 'en'
type ThemeMode = 'dark' | 'light' | 'system'
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
      title: 'Landing pronta para negocio com Auralith Stack',
      description: 'Template com UI consistente, fluxo de contato com Supabase e receitas de deploy para publicar rapido.',
      primary: 'Ver servicos',
      secondary: 'Falar com time',
    },
    services: {
      label: 'solucoes',
      title: 'Estrutura pensada para acelerar entrega',
      items: [
        { title: 'Design system integrado', description: 'Auralith UI pronto para manter consistencia visual e evolucao rapida.' },
        { title: 'Contato com leads', description: 'Envio para Supabase com fallback FormSubmit para nao perder oportunidades.' },
        { title: 'Deploy simplificado', description: 'Workflow de GitHub Pages e receita de Vercel para publicar sem friccao.' },
      ],
    },
    contact: {
      label: 'contato',
      title: 'Receba contatos com rastreabilidade desde o primeiro deploy',
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
      title: 'Business-ready landing with Auralith Stack',
      description: 'Template with consistent UI, Supabase-powered contact flow, and deploy recipes to ship fast.',
      primary: 'View services',
      secondary: 'Contact team',
    },
    services: {
      label: 'solutions',
      title: 'Structure designed for delivery speed',
      items: [
        { title: 'Integrated design system', description: 'Auralith UI included to keep visual consistency and fast iteration.' },
        { title: 'Lead-ready contact flow', description: 'Submit to Supabase with FormSubmit fallback so no lead is lost.' },
        { title: 'Simplified deploy', description: 'GitHub Pages workflow and Vercel recipe included for quick publishing.' },
      ],
    },
    contact: {
      label: 'contact',
      title: 'Capture leads with traceability from the first deploy',
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
          <h1>{text.hero.title}</h1>
          <p>{text.hero.description}</p>
          <div className="actions">
            <Button onClick={scrollToContact}>{text.hero.primary}</Button>
            <Button onClick={scrollToContact} variant="secondary">{text.hero.secondary}</Button>
          </div>
        </GlassPanel>

        <section className="grid">
          <SectionLabel>{text.services.label}</SectionLabel>
          <h2 className="section-title">{text.services.title}</h2>
          <div className="cards">
            {text.services.items.map((item) => (
              <Card className="item" key={item.title} variant="subtle">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
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
