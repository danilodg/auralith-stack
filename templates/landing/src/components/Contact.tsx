import { FormEvent } from 'react'
import { Button, GlassPanel, Input, SectionLabel, Textarea, useToast } from 'auralith-ui'

type ContactProps = {
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

export function Contact({ text, onSubmit, isSubmitting }: ContactProps) {
  return (
    <section className="contact" id="contact">
      <GlassPanel className="contact-panel">
        <SectionLabel>{text.label}</SectionLabel>
        <h2 className="section-title">{text.title}</h2>
        <form className="contact-form" onSubmit={onSubmit}>
          <input name="_subject" type="hidden" value="[Auralith Landing] New contact" />
          <input name="_captcha" type="hidden" value="false" />
          <input name="_template" type="hidden" value="table" />

          <div className="form-row">
            <Input.Root>
              <Input.Label>{text.name}</Input.Label>
              <Input.Field name="name" required />
            </Input.Root>
            <Input.Root>
              <Input.Label>{text.email}</Input.Label>
              <Input.Field name="email" required type="email" />
            </Input.Root>
          </div>

          <div className="form-row">
            <Input.Root>
              <Input.Label>{text.phone}</Input.Label>
              <Input.Field
                name="phone"
                onInput={(event) => {
                  const input = event.currentTarget
                  input.value = formatPhoneMask(input.value)
                }}
                pattern="\(\d{2}\)\s\d{4,5}-\d{4}"
                required
                type="tel"
              />
            </Input.Root>
            <Input.Root>
              <Input.Label>{text.subject}</Input.Label>
              <Input.Field name="subject" required />
            </Input.Root>
          </div>

          <Textarea.Root>
            <Textarea.Label>{text.message}</Textarea.Label>
            <Textarea.Field name="message" required rows={4} />
          </Textarea.Root>

          <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button disabled={isSubmitting} type="submit">{isSubmitting ? text.submitting : text.submit}</Button>
          </div>
        </form>
      </GlassPanel>
    </section>
  )
}
