'use client'

import { useEffect } from 'react'
import { animate } from 'framer-motion'

function scrollMarginTop(el: Element): number {
  return parseFloat(window.getComputedStyle(el).scrollMarginTop) || 0
}

function scrollToElement(el: HTMLElement) {
  const targetY = window.scrollY + el.getBoundingClientRect().top - scrollMarginTop(el)

  animate(window.scrollY, targetY, {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
    onUpdate: (value) => window.scrollTo(0, value),
  })
}

/**
 * Sitewide: clicking any same-page #anchor link (Read More links, Share
 * buttons, nav links, etc.) scrolls there smoothly via Framer Motion
 * instead of the browser's instant jump. Mounted once in the root layout.
 */
export function SmoothAnchorScroll() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const url = new URL(anchor.href)
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === '#') return

      const target = document.getElementById(url.hash.slice(1))
      if (!target) return

      e.preventDefault()
      scrollToElement(target)
      window.history.pushState(null, '', url.hash)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
