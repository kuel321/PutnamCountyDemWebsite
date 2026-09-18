'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export function ShareButton({
  title,
  url,
  className,
}: {
  title: string
  /** Path or absolute URL to share. Defaults to the current page. */
  url?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareUrl = url ? new URL(url, window.location.origin).toString() : window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl })
      } catch {
        // User closed the share sheet without picking anything — nothing to do.
      }
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied — no further fallback available.
    }
  }

  return (
    <button type="button" onClick={handleShare} aria-label={copied ? 'Link copied' : 'Share this page'} className={className}>
      {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
    </button>
  )
}
