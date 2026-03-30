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

        {/* Offset border box — sits behind image and content */}
        <div className="mtc-border-box" />

        {/* Image — bleeds outside the border box */}
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
        </div>

        {/* Content */}
        <div className="mtc-content">
          <div className="mtc-heading-group">
            <div className="mtc-eyebrow-row">
              <span className="mtc-eyebrow-badge">
                <span className="mtc-eyebrow-text">{safeEyebrow}</span>
              </span>
              <span className="mtc-eyebrow-line" />
            </div>
            <h2 className="mtc-name">{name}</h2>
          </div>

          <div className="mtc-divider" />

          <div className="mtc-bio">
            <RichText data={bio} enableGutter={false} />
          </div>

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
                  <React.Fragment key={i}>
                    {i > 0 && <span className="mtc-link-sep" />}
                    <Link
                      href={href}
                      className="mtc-link"
                      target={link.newTab ? '_blank' : undefined}
                      rel={link.newTab ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}