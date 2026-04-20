import { Card, SectionLabel, Tag, Tabs, TabsList, TabsTrigger, TabsContent } from 'auralith-ui'

type FeaturesProps = {
  text: any
}

export function Features({ text }: FeaturesProps) {
  return (
    <section className="grid">
      <SectionLabel>{text.label}</SectionLabel>
      <h2 className="section-title">{text.title}</h2>
      
      {/* Inspired by TechLanding/webDevLanding structure via Tabs */}
      <Tabs defaultValue="all" aria-label="Features">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          {text.items.map((item: any, idx: number) => (
             <TabsTrigger key={idx} value={`item-${idx}`}>{item.title}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="cards">
            {text.items.map((item: any, idx: number) => (
              <Card className="item" key={idx} variant="subtle">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Tag className="impact-tag">{item.impact}</Tag>
              </Card>
            ))}
          </div>
        </TabsContent>
        {text.items.map((item: any, idx: number) => (
          <TabsContent key={idx} value={`item-${idx}`}>
             <Card className="item" variant="subtle">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Tag className="impact-tag">{item.impact}</Tag>
              </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
