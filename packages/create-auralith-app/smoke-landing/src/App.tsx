import { Button, Card, GlassPanel, SectionLabel, Tag } from 'auralith-ui'

export function App() {
  return (
    <main className="page">
      <div className="container">
        <GlassPanel className="hero">
          <Tag>smoke-landing</Tag>
          <h1>Launch your next landing with Auralith Stack</h1>
          <p>Polished layout, reusable UI, and deploy-ready setup from day one.</p>
          <div className="actions">
            <Button>Get Started</Button>
            <Button variant="secondary">Contact</Button>
          </div>
        </GlassPanel>

        <section className="grid">
          <Card className="item" variant="subtle">
            <SectionLabel>speed</SectionLabel>
            <h2>Fast kickoff</h2>
            <p>Start from a structure that already includes design system integration and modern conventions.</p>
          </Card>
          <Card className="item" variant="subtle">
            <SectionLabel>consistency</SectionLabel>
            <h2>Unified components</h2>
            <p>Ship interfaces with consistent spacing, typography, and interaction patterns.</p>
          </Card>
          <Card className="item" variant="subtle">
            <SectionLabel>deploy</SectionLabel>
            <h2>Ready to publish</h2>
            <p>Use included deploy recipes to publish quickly on Pages or Vercel.</p>
          </Card>
        </section>
      </div>
    </main>
  )
}
