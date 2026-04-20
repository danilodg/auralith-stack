import { Card, SectionLabel } from 'auralith-ui'

type MetricsOverviewProps = {
  text: any
  metricValues: any
}

export function MetricsOverview({ text, metricValues }: MetricsOverviewProps) {
  return (
    <section className="metrics">
      <Card className="metric" variant="subtle">
        <SectionLabel>{text.labels.mrr}</SectionLabel>
        <strong>{metricValues.mrr}</strong>
      </Card>
      <Card className="metric" variant="subtle">
        <SectionLabel>{text.labels.churn}</SectionLabel>
        <strong>{metricValues.churn}</strong>
      </Card>
      <Card className="metric" variant="subtle">
        <SectionLabel>{text.labels.activation}</SectionLabel>
        <strong>{metricValues.activation}</strong>
      </Card>
      <Card className="metric" variant="subtle">
        <SectionLabel>{text.labels.nps}</SectionLabel>
        <strong>{metricValues.nps}</strong>
      </Card>
    </section>
  )
}
