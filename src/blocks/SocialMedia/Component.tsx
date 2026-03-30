'use client'
import React from 'react'
import { motion } from 'framer-motion'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  Music2,
} from 'lucide-react'
import type { SocialMediaBlock as SocialMediaBlockProps } from '@/payload-types'
import './styles.css'

const platformMeta: Record<string, { name: string; Icon: React.FC<{ size?: number }> }> = {
  facebook:  { name: 'Facebook',  Icon: Facebook },
  twitter:   { name: 'X / Twitter', Icon: Twitter },
  instagram: { name: 'Instagram', Icon: Instagram },
  youtube:   { name: 'YouTube',   Icon: Youtube },
  tiktok:    { name: 'TikTok',    Icon: Music2 },
  linkedin:  { name: 'LinkedIn',  Icon: Linkedin },
  website:   { name: 'Website',   Icon: Globe },
}

export const SocialMediaBlock: React.FC<SocialMediaBlockProps> = (props) => {
  const { eyebrow, heading, accounts } = props
  const safeAccounts = accounts ?? []

  return (
    <section className="sm-root">
      <div className="sm-inner">

        {eyebrow && (
          <motion.div
            className="sm-eyebrow-row"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="sm-star" aria-hidden="true">★</span>
            <span className="sm-eyebrow">{eyebrow}</span>
            <span className="sm-star" aria-hidden="true">★</span>
          </motion.div>
        )}

        {heading && (
          <motion.h2
            className="sm-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {heading}
          </motion.h2>
        )}
        <span className="sm-heading-rule" />

        <motion.div
          className="sm-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
          }}
        >
          {safeAccounts.map((account, i) => {
            const meta = platformMeta[account.platform] ?? { name: account.platform, Icon: Globe }
            const { Icon } = meta

            return (
              <motion.a
                key={i}
                href={account.url}
                className="sm-card"
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
                  },
                }}
              >
                <div className="sm-card-accent" />
                <div className="sm-icon">
                  <Icon size={28} />
                </div>
                <span className="sm-platform-name">{meta.name}</span>
                {account.label && <span className="sm-label">{account.label}</span>}
              </motion.a>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
