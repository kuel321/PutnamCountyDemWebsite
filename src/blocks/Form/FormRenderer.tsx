'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Form } from '@/payload-types'
import { Recaptcha } from './Recaptcha'

// Field names the beforeValidate hook on form-submissions (src/plugins/index.ts)
// looks for and strips before saving — keep these two in sync.
const HONEYPOT_FIELD = '_hp'
const RECAPTCHA_FIELD = '_recaptcha'

type FormField = NonNullable<Form['fields']>[number]

const inputClassName =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none'
const labelClassName = 'block text-sm font-medium text-gray-700'

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: string | boolean
  onChange: (name: string, value: string | boolean) => void
}) {
  if (field.blockType === 'message') {
    return field.message ? <RichText data={field.message} className="prose prose-sm max-w-none" /> : null
  }

  if (field.blockType === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          required={field.required ?? false}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        {field.label}
        {field.required && <span className="text-brand-red"> *</span>}
      </label>
    )
  }

  return (
    <div>
      <label htmlFor={field.name} className={labelClassName}>
        {field.label}
        {field.required && <span className="text-brand-red"> *</span>}
      </label>

      {field.blockType === 'textarea' ? (
        <textarea
          id={field.name}
          required={field.required ?? false}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          rows={4}
          className={inputClassName}
        />
      ) : field.blockType === 'select' ? (
        <select
          id={field.name}
          required={field.required ?? false}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={inputClassName}
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((option) => (
            <option key={option.id ?? option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          type={field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'}
          required={field.required ?? false}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={inputClassName}
        />
      )}
    </div>
  )
}

function getInitialValues(form: Form): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {}
  for (const field of form.fields ?? []) {
    if (!('name' in field) || !('defaultValue' in field) || field.defaultValue == null) continue
    values[field.name] = typeof field.defaultValue === 'number' ? String(field.defaultValue) : field.defaultValue
  }
  return values
}

export function FormRenderer({ form }: { form: Form }) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string | boolean>>(() => getInitialValues(form))
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [honeypot, setHoneypot] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  function handleChange(name: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.id,
          submissionData: [
            ...Object.entries(values).map(([field, value]) => ({
              field,
              value: String(value),
            })),
            { field: HONEYPOT_FIELD, value: honeypot },
            { field: RECAPTCHA_FIELD, value: recaptchaToken },
          ],
        }),
      })

      if (!res.ok) throw new Error('Submission failed')

      if (form.confirmationType === 'redirect' && form.redirect?.url) {
        router.push(form.redirect.url)
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return form.confirmationMessage ? (
      <RichText data={form.confirmationMessage} className="prose max-w-none" />
    ) : (
      <p className="text-gray-700">Thanks — your submission was received.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {form.fields?.map((field, index) => (
        <FieldInput
          key={field.id ?? index}
          field={field}
          value={'name' in field ? (values[field.name] ?? '') : ''}
          onChange={handleChange}
        />
      ))}

      {/* Honeypot — invisible to real visitors, real spam bots fill every field they can find. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Recaptcha onChange={setRecaptchaToken} />

      {status === 'error' && (
        <p className="text-sm text-brand-red">
          Something went wrong submitting this form. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : form.submitButtonLabel || 'Submit'}
      </button>
    </form>
  )
}
