import { Accordion, AccordionItem, GlassPanel, SectionLabel } from 'auralith-ui'

type FAQProps = {
  // Let's invent some text for FAQ or make it optional
  text?: any
}

export function FAQ({ text }: FAQProps) {
  // Mock data as the content didn't have FAQ initially, or we can use a passed mock if we add to content in future
  const defaultFaqs = [
    {
      question: 'Como funciona o processo de deploy?',
      answer: 'Tudo é feito em semanas, com scripts e esteiras de CI/CD pré-configuradas para Vercel e Edge Functions.',
    },
    {
      question: 'Posso usar o Supabase mesmo com plano Launch?',
      answer: 'Sim, todos os projetos já nascem conectados ao seu próprio projeto e funções no Supabase.',
    },
    {
      question: 'O design pode ser alterado posteriormente?',
      answer: 'Sem dúvidas. Graças à estrutura com auralith-ui, modificar variáveis globais é simples e seguro.',
    }
  ]

  const items = text?.items || defaultFaqs

  return (
    <section className="faq">
      <GlassPanel className="faq-panel">
        <SectionLabel>{text?.label || 'dúvidas frequentes'}</SectionLabel>
        <h2 className="section-title">{text?.title || 'Tudo o que você precisa saber'}</h2>
        
        <br />
        <Accordion type="single" collapsible>
          {items.map((item: any, idx: number) => (
            <AccordionItem key={idx} value={`faq-${idx}`} title={item.question}>
              {item.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </GlassPanel>
    </section>
  )
}
