import { Button, GlassPanel, Tag } from 'auralith-ui'

type HeroProps = {
  text: any
  onContactClick: () => void
}

export function Hero({ text, onContactClick }: HeroProps) {
  return (
    <GlassPanel className="hero">
      <h1>{text.title}</h1>
      <p>{text.description}</p>
      <div className="actions">
        <Button onClick={onContactClick}>{text.primary}</Button>
        <Button onClick={onContactClick} variant="secondary">{text.secondary}</Button>
      </div>
      <div className="trust-strip">
        {text.trust.map((item: string) => (
          <Tag className="trust-tag" key={item}>{item}</Tag>
        ))}
      </div>
    </GlassPanel>
  )
}
