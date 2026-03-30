import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

  return (
    <section className="mtc-root">
      <div className={`mtc-inner ${safePosition === 'right' ? 'image-right' : ''}`}>

        {/* Image pane */}
        <div className="mtc-image-pane">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
          {/* Red overlay strip on inner edge */}
          <div className="mtc-image-strip" />
        </div>

        {/* Content */}
        <div className="mtc-content">

          {/* Eyebrow */}
          <div className="mtc-eyebrow-row">
            <span className="mtc-star" aria-hidden="true">★</span>
            <span className="mtc-eyebrow">{safeEyebrow}</span>
            <span className="mtc-star" aria-hidden="true">★</span>
          </div>

          {/* Name */}
          <h2 className="mtc-name">{name}</h2>
          <div className="mtc-rule" />

          {/* Bio */}
          <div className="mtc-bio">
            <RichText data={bio} enableGutter={false} />
          </div>

          {/* Links */}
          {safeLinks.length > 0 && (
            <div className="mtc-links">
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
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
