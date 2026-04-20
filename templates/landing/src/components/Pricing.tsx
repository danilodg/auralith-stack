import { Card, GlassPanel, SectionLabel, Tabs, TabsList, TabsTrigger } from 'auralith-ui'
import type { BillingCycle } from '../data'

type PricingProps = {
  text: any
  billingCycle: BillingCycle
  setBillingCycle: (cycle: BillingCycle) => void
}

export function Pricing({ text, billingCycle, setBillingCycle }: PricingProps) {
  return (
    <GlassPanel className="contact-panel plan-panel">
      <SectionLabel>{text.label}</SectionLabel>
      <h2 className="section-title">{text.title}</h2>
      
      <Tabs value={billingCycle} onValueChange={(val) => setBillingCycle(val as BillingCycle)}>
        <TabsList>
          <TabsTrigger value="monthly">{text.period.monthly}</TabsTrigger>
          <TabsTrigger value="yearly">{text.period.yearly}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="plan-cards">
        {text.cards.map((plan: any) => (
          <Card className="plan-card" key={plan.name} variant="subtle">
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <strong>{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</strong>
            <span>{plan.outcome}</span>
          </Card>
        ))}
      </div>
    </GlassPanel>
  )
}
