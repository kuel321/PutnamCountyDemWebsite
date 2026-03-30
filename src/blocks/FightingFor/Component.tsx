'use client'
import React from 'react'
import { motion } from 'framer-motion'
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
        <motion.div
          className="ff-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {eyebrow && (
            <div className="ff-eyebrow-row">
              <span className="ff-star" aria-hidden="true">★</span>
              <span className="ff-eyebrow">{eyebrow}</span>
              <span className="ff-star" aria-hidden="true">★</span>
            </div>
          )}
          <h2 className="ff-heading">{heading}</h2>
          <div className="ff-heading-rule" />
        </motion.div>

        {/* Issue Cards Grid — staggered */}
        {safeIssues.length > 0 && (
          <motion.div
            className="ff-grid"
            data-count={safeIssues.length}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
            }}
          >
            {safeIssues.map((issue, i) => (
              <motion.article
                className="ff-card"
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 28, scale: 0.97 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                  },
                }}
              >
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
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
