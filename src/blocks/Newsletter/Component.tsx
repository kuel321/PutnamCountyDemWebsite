'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { getClientSideURL } from '@/utilities/getURL'
import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'
import './styles.css'

type Props = NewsletterBlockProps & {
  form: FormType
}

export const NewsletterBlock: React.FC<Props> = (props) => {
  const {
    eyebrow,
    heading,
    subtext,
    placeholder = 'Your email address',
    buttonLabel = 'Sign Up',
    successMessage = "You're on the list — thank you!",
    form,
  } = props

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find the email field name from the linked form
  const emailField = form?.fields?.find((f) => f.blockType === 'email')
  const emailFieldName = emailField ? (emailField as { name: string }).name : 'email'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !form?.id) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.id,
          submissionData: [{ field: emailFieldName, value: email }],
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.errors?.[0]?.message || 'Something went wrong.')
      }

      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="nl-root">
      <span className="nl-bg-star" aria-hidden="true">★</span>
      <div className="nl-inner">

        {eyebrow && (
          <motion.div
            className="nl-eyebrow-row"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="nl-star" aria-hidden="true">★</span>
            <span className="nl-eyebrow">{eyebrow}</span>
            <span className="nl-star" aria-hidden="true">★</span>
          </motion.div>
        )}

        <motion.h2
          className="nl-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {heading}
        </motion.h2>
        <span className="nl-heading-rule" />

        {subtext && (
          <motion.p
            className="nl-subtext"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {subtext}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {submitted ? (
            <p className="nl-success">{successMessage}</p>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit} noValidate>
              <input
                className="nl-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                aria-label="Email address"
              />
              <button className="nl-button" type="submit" disabled={loading}>
                {loading ? '...' : buttonLabel}
              </button>
            </form>
          )}
          {error && <p className="nl-error">{error}</p>}
          {!submitted && (
            <p className="nl-privacy">No spam. Unsubscribe at any time.</p>
          )}
        </motion.div>

      </div>
    </section>
  )
}
