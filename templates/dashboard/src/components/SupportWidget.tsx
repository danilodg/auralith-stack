import { FormEvent } from 'react'
import { Button, GlassPanel, Input, SectionLabel, Textarea } from 'auralith-ui'

type SupportWidgetProps = {
  text: any
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  isSubmitting: boolean
}

function formatPhoneMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function SupportWidget({ text, onSubmit, isSubmitting }: SupportWidgetProps) {
  return (
    <section className="contact">
      <GlassPanel className="contact-panel">
        <SectionLabel>{text.section}</SectionLabel>
        <h2 className="section-title">{text.title}</h2>

        <form className="contact-form" onSubmit={onSubmit}>
          <input name="_subject" type="hidden" value="[Auralith Dashboard] New support ticket" />
          <input name="_captcha" type="hidden" value="false" />
          <input name="_template" type="hidden" value="table" />

          <div className="form-row">
            <Input label={text.labels.name} name="name" required />
            <Input label={text.labels.email} name="email" required type="email" />
          </div>

          <div className="form-row">
            <Input
              label={text.labels.phone}
              name="phone"
              onInput={(event) => {
                const input = event.currentTarget
                input.value = formatPhoneMask(input.value)
              }}
              pattern="\(\d{2}\)\s\d{4,5}-\d{4}"
              required
              type="tel"
            />
            <Input label={text.labels.subject} name="subject" required />
          </div>

          <Textarea label={text.labels.message} name="message" required rows={4} />

          <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button disabled={isSubmitting} type="submit">{isSubmitting ? text.submitting : text.submit}</Button>
          </div>
        </form>
      </GlassPanel>
    </section>
  )
}
