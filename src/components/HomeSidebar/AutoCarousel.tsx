'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export function AutoCarousel({
  items,
  intervalMs = 6000,
}: {
  items: ReactNode[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (items.length <= 1 || paused) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [items.length, intervalMs, paused])

  if (items.length === 0) return null

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Show slide ${dotIndex + 1}`}
              onClick={() => setIndex(dotIndex)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                dotIndex === index ? 'bg-brand-navy' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
