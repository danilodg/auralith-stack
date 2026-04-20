import type { FormEvent } from 'react'

export type Language = 'pt' | 'en'
export type ThemeMode = 'dark' | 'light' | 'system'
export type Period = '7d' | '30d' | '90d'
export type Segment = 'all' | 'smb' | 'mid' | 'enterprise'
export type Lifecycle = 'all' | 'trial' | 'active' | 'at-risk'
export type FormStatus = { type: 'idle' | 'success' | 'error'; message: string }

export type ProjectRow = {
  account: string
  lifecycle: Exclude<Lifecycle, 'all'>
  segment: Exclude<Segment, 'all'>
  mrr: string
  owner: string
  renewal: string
  health: 'healthy' | 'watch' | 'critical'
}

export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || ''
export const formSubmitToken = import.meta.env.VITE_FORMSUBMIT_TOKEN?.trim()
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
export const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
export const supabaseContactFunction = import.meta.env.VITE_SUPABASE_CONTACT_FUNCTION?.trim() || 'contact-lead'

export const content = {
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
      sync: 'Sync: há 2 min',
      env: 'Env: production',
    },
    metrics: {
      labels: {
        mrr: 'MRR total',
        churn: 'Churn mensal',
        activation: 'Ativação onboarding',
        nps: 'NPS operacional',
      },
      period: {
        '7d': { mrr: 'R$ 286k', churn: '1.2%', activation: '71%', nps: '54' },
        '30d': { mrr: 'R$ 1.18M', churn: '1.8%', activation: '68%', nps: '49' },
        '90d': { mrr: 'R$ 3.42M', churn: '2.1%', activation: '65%', nps: '46' },
      },
    },
    filters: {
      period: 'Período',
      segment: 'Segmento',
      lifecycle: 'Status da conta',
      periodOptions: {
        '7d': { label: '7 dias', description: 'Visão curta para operação diária' },
        '30d': { label: '30 dias', description: 'Análise mensal para planejamento' },
        '90d': { label: '90 dias', description: 'Tendência trimestral de receita' },
      },
      segmentOptions: {
        all: { label: 'Todos', description: 'SMB, Mid e Enterprise' },
        smb: { label: 'SMB', description: 'Times até 50 usuários' },
        mid: { label: 'Mid-Market', description: 'Operação em crescimento' },
        enterprise: { label: 'Enterprise', description: 'Contas com governança forte' },
      },
      lifecycleOptions: {
        all: { label: 'Todos', description: 'Qualquer fase de ciclo' },
        trial: { label: 'Trial', description: 'Contas em ativação inicial' },
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
      title: 'Contas com receita, risco e previsão de renovação',
      search: 'Buscar conta, owner ou segmento...',
      cta: 'Criar playbook',
      columns: {
        account: 'Conta',
        segment: 'Segmento',
        lifecycle: 'Status',
        mrr: 'MRR',
        owner: 'Owner',
        renewal: 'Renovação',
      },
      empty: 'Nenhuma conta para esse recorte. Ajuste os filtros.',
    },
    contact: {
      section: 'suporte',
      title: 'Abrir chamado técnico direto do dashboard',
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

export const baseRows: ProjectRow[] = [
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
