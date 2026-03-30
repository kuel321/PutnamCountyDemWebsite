'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import RichText from '@/components/RichText'

import type { MeetTheCandidateBlock as MeetTheCandidateBlockProps } from '@/payload-types'

import './styles.css'

export const MeetTheCandidateBlock: React.FC<MeetTheCandidateBlockProps> = (props) => {
  const { eyebrow, name, bio, image, links, imagePosition } = props

  const safeLinks = links ?? []
  const safePosition = imagePosition ?? 'left'
  const safeEyebrow = eyebrow ?? 'Meet'

  if (!image || typeof image !== 'object') return null

  const imageUrl = image.url ?? ''
  const imageAlt = image.alt || name
  const imageOnLeft = safePosition !== 'right'

  return (
    <section className="mtc-root">
      <div className={`mtc-inner ${safePosition === 'right' ? 'image-right' : ''}`}>

        {/* Image pane */}
        <motion.div
          className="mtc-image-pane"
          initial={{ opacity: 0, x: imageOnLeft ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
          <div className="mtc-image-strip" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="mtc-content"
          initial={{ opacity: 0, x: imageOnLeft ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            className="mtc-eyebrow-row"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="mtc-star" aria-hidden="true">★</span>
            <span className="mtc-eyebrow">{safeEyebrow}</span>
            <span className="mtc-star" aria-hidden="true">★</span>
          </motion.div>

          {/* Name */}
          <motion.h2
            className="mtc-name"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {name}
          </motion.h2>
          <div className="mtc-rule" />

          {/* Bio */}
          <motion.div
            className="mtc-bio"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <RichText data={bio} enableGutter={false} />
          </motion.div>

          {/* Links */}
          {safeLinks.length > 0 && (
            <motion.div
              className="mtc-links"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {safeLinks.map((item, i) => {
                const link = item.link
                const ref = link.reference as
                  | { value: { slug?: string | null } | number | null }
                  | null
                  | undefined
                const refValue = ref && typeof ref.value === 'object' ? ref.value : null
                const href =
                  link.type === 'reference' && refValue?.slug
                    ? `/${refValue.slug}`
                    : (link.url ?? '#')

                return (
                  <Link
                    key={i}
                    href={href}
                    className="mtc-link"
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  )
}
