'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <RichText className="mb-6" data={richText} enableGutter={false} />
            </motion.div>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <motion.ul
              className="flex md:justify-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
      <motion.div
        className="min-h-[80vh] select-none"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </motion.div>
    </div>
  )
}
