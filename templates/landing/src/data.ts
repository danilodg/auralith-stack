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

export { contactEmail, formSubmitToken, supabaseUrl, supabasePublishableKey, supabaseContactFunction, content }
export type { Language, ThemeMode, BillingCycle, IntegrationFilter, FormStatus }
