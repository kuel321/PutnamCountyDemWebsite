'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const words = [
  'working families.',
  'our land.',
  'our water.',
  'our schools.',
  'fair wages.',
  'our future.',
  'you.',
]

export function RotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="inline-block overflow-hidden align-bottom leading-[1.15]">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="block text-brand-red"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
