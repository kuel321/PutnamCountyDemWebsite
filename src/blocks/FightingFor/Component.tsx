import React from 'react'
import RichText from '@/components/RichText'
import type { FightingForBlock as FightingForBlockProps } from '@/payload-types'
import './styles.css'

export const FightingForBlock: React.FC<FightingForBlockProps> = (props) => {
  const { eyebrow, heading, issues } = props

  const safeIssues = issues ?? []

  return (
    <section className="ff-root">
      <div className="ff-inner">
        {/* Header */}
        <div className="ff-header">
          {eyebrow && (
            <div className="ff-eyebrow-row">
              <span className="ff-star" aria-hidden="true">★</span>
              <span className="ff-eyebrow">{eyebrow}</span>
              <span className="ff-star" aria-hidden="true">★</span>
            </div>
          )}
          <h2 className="ff-heading">{heading}</h2>
          <div className="ff-heading-rule" />
        </div>

        {/* Issue Cards Grid */}
        {safeIssues.length > 0 && (
          <div className="ff-grid" data-count={safeIssues.length}>
            {safeIssues.map((issue, i) => (
              <article className="ff-card" key={i}>
                <div className="ff-card-accent" />
                {issue.icon && (
                  <div className="ff-card-icon" aria-hidden="true">
                    {issue.icon}
                  </div>
                )}
                <h3 className="ff-card-title">{issue.title}</h3>
                {issue.description && (
                  <div className="ff-card-desc">
                    <RichText data={issue.description} enableGutter={false} />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
