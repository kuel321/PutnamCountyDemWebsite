'use client'

import { useCallback, useEffect, useRef } from 'react'

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }
  }
}

// Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY (and RECAPTCHA_API_KEY +
// RECAPTCHA_PROJECT_ID, used server-side in src/plugins/index.ts) to turn
// this on — until then getRecaptchaToken() resolves to an empty string and
// forms submit normally without it.
//
// This is reCAPTCHA Enterprise, score-based (v3) — fully invisible, no
// checkbox to render. A token has to be fetched fresh right before
// submitting (not on page load): Google expires it after 2 minutes, and a
// visitor can easily take longer than that to fill out a form.
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const SCRIPT_ID = 'recaptcha-enterprise-script'

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (!SITE_KEY) {
      resolve()
      return
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      if (window.grecaptcha?.enterprise) resolve()
      else existing.addEventListener('load', () => resolve())
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

/**
 * Returns a getToken(action) function. Call it right before submitting —
 * resolves to '' (inert) if reCAPTCHA isn't configured, so forms keep
 * working normally either way.
 */
export function useRecaptchaToken() {
  const scriptReady = useRef<Promise<void> | null>(null)

  useEffect(() => {
    if (SITE_KEY && !scriptReady.current) {
      scriptReady.current = loadScript()
    }
  }, [])

  const getToken = useCallback(async (action: string): Promise<string> => {
    if (!SITE_KEY) return ''

    if (!scriptReady.current) scriptReady.current = loadScript()
    await scriptReady.current

    if (!window.grecaptcha?.enterprise) return ''

    return new Promise((resolve) => {
      window.grecaptcha!.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha!.enterprise.execute(SITE_KEY!, { action })
          resolve(token)
        } catch {
          resolve('')
        }
      })
    })
  }, [])

  return getToken
}
