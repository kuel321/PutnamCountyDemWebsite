'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
        },
      ) => number
    }
  }
}

// Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY (and RECAPTCHA_SECRET_KEY, used
// server-side in src/plugins/index.ts) to turn this on — until then it
// shows a placeholder and forms submit normally without it. Google
// reCAPTCHA v2/v3 is free up to a generous monthly quota; check current
// terms on Google's reCAPTCHA page when you actually sign up for keys.
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export function Recaptcha({ onChange }: { onChange: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (!scriptLoaded || !SITE_KEY || !containerRef.current || !window.grecaptcha) return

    window.grecaptcha.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: onChange,
      'expired-callback': () => onChange(''),
    })
    // Only run once per mount — grecaptcha.render throws if called twice
    // on the same container, and onChange is stable enough in practice here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded])

  if (!SITE_KEY) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-500">
        reCAPTCHA placeholder — set <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> and{' '}
        <code>RECAPTCHA_SECRET_KEY</code> to enable spam protection on this form.
      </div>
    )
  }

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" onLoad={() => setScriptLoaded(true)} />
      <div ref={containerRef} />
    </>
  )
}
