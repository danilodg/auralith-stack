import { Card, GlassPanel, SectionLabel, Select } from 'auralith-ui'
import type { IntegrationFilter } from '../data'

type IntegrationsProps = {
  text: any
  filteredIntegrations: readonly any[]
  integrationFilter: IntegrationFilter
  setIntegrationFilter: (filter: IntegrationFilter) => void
}

export function Integrations({ text, filteredIntegrations, integrationFilter, setIntegrationFilter }: IntegrationsProps) {
  return (
    <GlassPanel className="contact-panel integrations-panel">
      <SectionLabel>{text.label}</SectionLabel>
      <h2 className="section-title">{text.title}</h2>
      <Select
        label={text.filterLabel}
        onValueChange={(value) => setIntegrationFilter(value as IntegrationFilter)}
        value={integrationFilter}
      >
        <Select.Option
          description={text.filters.all.description}
          label={text.filters.all.label}
          value="all"
        />
        <Select.Option
          description={text.filters.lead.description}
          label={text.filters.lead.label}
          value="lead"
        />
        <Select.Option
          description={text.filters.payments.description}
          label={text.filters.payments.label}
          value="payments"
        />
        <Select.Option
          description={text.filters.support.description}
          label={text.filters.support.label}
          value="support"
        />
      </Select>
      <div className="integration-list">
        {filteredIntegrations.map((item: any) => (
          <Card className="integration-item" key={item.name} variant="subtle">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </GlassPanel>
  )
}
