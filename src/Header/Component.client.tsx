'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
  pages: { id: number; title: string; slug: string }[]
}

const headerStyles = `
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: #0a0f1e;
    border-bottom: 3px solid #c8a84b;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  }

  .site-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
  }

  .site-header-logo {
    display: inline-block;
    text-decoration: none;
    flex-shrink: 0;
    transition: opacity 0.2s ease;
    line-height: 1;
  }

  .site-header-logo:hover {
    opacity: 0.8;
  }

  .site-header-wordmark {
    font-family: 'Arial Narrow', Arial, sans-serif;
    font-weight: 900;
    font-size: 17px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #ffffff;
    white-space: nowrap;
  }

  .site-header-wordmark span {
    color: #c8a84b;
  }

  .site-header-nav {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .site-header-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-family: 'Arial Narrow', 'Arial', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 8px 16px;
    transition: color 0.18s ease;
    position: relative;
    white-space: nowrap;
  }

  .site-header-link:hover {
    color: #c8a84b;
  }

  .site-header-link.active {
    color: #c8a84b;
  }

  .site-header-link.active::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 16px;
    right: 16px;
    height: 2px;
    background-color: #c8a84b;
    border-radius: 1px;
  }

  .site-header-link + .site-header-link::before {
    content: '·';
    position: absolute;
    left: 0;
    color: rgba(200, 168, 75, 0.3);
  }

  /* Hamburger toggle (mobile only) */
  .site-header-toggle {
    display: none;
    background: none;
    border: 1px solid rgba(200, 168, 75, 0.4);
    border-radius: 4px;
    padding: 7px 10px;
    cursor: pointer;
    color: #c8a84b;
    font-family: 'Arial Narrow', 'Arial', sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 700;
    transition: border-color 0.15s ease, color 0.15s ease;
    gap: 6px;
    align-items: center;
  }

  .site-header-toggle:hover {
    border-color: #c8a84b;
    color: #fff;
  }

  /* Mobile drawer */
  .site-header-mobile-nav {
    display: none;
    background-color: #0d1426;
    border-top: 1px solid rgba(200, 168, 75, 0.15);
    padding: 12px 24px 20px;
    flex-direction: column;
    gap: 2px;
  }

  .site-header-mobile-nav.open {
    display: flex;
  }

  .site-header-mobile-link {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-family: 'Arial Narrow', 'Arial', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 12px 4px;
    border-bottom: 1px solid rgba(200, 168, 75, 0.08);
    transition: color 0.15s ease;
  }

  .site-header-mobile-link:last-child {
    border-bottom: none;
  }

  .site-header-mobile-link:hover,
  .site-header-mobile-link.active {
    color: #c8a84b;
  }

  @media (max-width: 768px) {
    .site-header-inner {
      padding: 0 16px;
    }

    .site-header-nav {
      display: none;
    }

    .site-header-toggle {
      display: flex;
    }

    .site-header-wordmark {
      font-size: 12px;
      letter-spacing: 0.08em;
    }
  }
`

const navContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
}

const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, pages }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const navItems = data?.navItems || []

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
      <header className="site-header" {...(theme ? { 'data-theme': theme } : {})}>
        <div className="site-header-inner">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Link className="site-header-logo" href="/">
              <span className="site-header-wordmark">
                David Edwards <span>for Putnam</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <motion.nav
            className="site-header-nav"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {pages.map((page) => (
              <motion.div key={page.id} variants={navLinkVariants}>
                <Link
                  href={`/${page.slug}`}
                  className={`site-header-link${pathname === `/${page.slug}` ? ' active' : ''}`}
                >
                  {page.title}
                </Link>
              </motion.div>
            ))}
            {navItems.map(({ link }, i) => (
              <motion.div key={i} variants={navLinkVariants}>
                <CMSLink {...link} className="site-header-link" appearance="link" />
              </motion.div>
            ))}
          </motion.nav>

          {/* Mobile toggle */}
          <button
            className="site-header-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? '✕ Close' : '☰ Menu'}
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`site-header-mobile-nav${menuOpen ? ' open' : ''}`}>
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/${page.slug}`}
              className={`site-header-mobile-link${pathname === `/${page.slug}` ? ' active' : ''}`}
            >
              {page.title}
            </Link>
          ))}
          {navItems.map(({ link }, i) => (
            <CMSLink key={i} {...link} className="site-header-mobile-link" appearance="link" />
          ))}
        </div>
      </header>
    </>
  )
}
