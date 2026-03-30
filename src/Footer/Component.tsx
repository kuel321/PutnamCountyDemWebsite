import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const footerStyles = `
  .footer-root {
    margin-top: auto;
    background-color: #0a0f1e;
    color: #fff;
    font-family: 'Georgia', 'Times New Roman', serif;
    border-top: 4px solid #c8a84b;
    position: relative;
    overflow: hidden;
  }

  /* Scale down whatever the Logo component renders */
  .footer-logo-link {
    display: inline-block;
    text-decoration: none;
    transition: opacity 0.2s ease;
    transform-origin: top left;
    transform: scale(0.55);
    /* Collapse the extra whitespace the scale creates */
    margin-bottom: -60px;
  }

  .footer-logo-link:hover {
    opacity: 0.8;
  }

  .footer-top {
    border-bottom: 1px solid rgba(200, 168, 75, 0.2);
    padding: 36px 0 28px;
  }

  .footer-top-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
  }

  .footer-brand {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .footer-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
  }

  .footer-tagline {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c8a84b;
    font-family: 'Arial Narrow', 'Arial', sans-serif;
    font-weight: 700;
    margin: 0;
  }

  .footer-disclaimer {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.38);
    font-family: 'Arial', sans-serif;
    font-style: italic;
    margin: 0;
    line-height: 1.5;
  }

  /* Right side: nav */
  .footer-nav-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
    flex-shrink: 0;
  }

  .footer-nav-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(200, 168, 75, 0.6);
    font-family: 'Arial', sans-serif;
    font-weight: 700;
    margin: 0;
  }

  .footer-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .footer-nav a,
  .footer-nav-link {
    color: rgba(255, 255, 255, 0.7) !important;
    text-decoration: none !important;
    font-family: 'Arial Narrow', 'Arial', sans-serif;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    transition: color 0.18s ease;
    position: relative;
    display: inline-block;
  }

  .footer-nav a::after,
  .footer-nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #c8a84b;
    transition: width 0.22s ease;
  }

  .footer-nav a:hover,
  .footer-nav-link:hover {
    color: #c8a84b !important;
  }

  .footer-nav a:hover::after,
  .footer-nav-link:hover::after {
    width: 100%;
  }

  /* Nav empty state hint */
  .footer-nav-empty {
    font-size: 11px;
    color: rgba(255,255,255,0.2);
    font-family: 'Arial', sans-serif;
    font-style: italic;
  }

  /* Bottom bar */
  .footer-bottom {
    padding: 14px 0;
  }

  .footer-bottom-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .footer-legal {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.28);
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.03em;
    line-height: 1.5;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0;
    flex-wrap: wrap;
  }

  .footer-legal a {
    color: rgba(255, 255, 255, 0.38);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .footer-legal a:hover {
    color: #c8a84b;
  }

  .footer-pipe {
    margin: 0 10px;
    color: rgba(255,255,255,0.15);
  }

  @media (max-width: 768px) {
    .footer-top-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 28px;
    }

    .footer-logo-link {
      transform-origin: top left;
    }

    .footer-nav-section {
      align-items: flex-start;
    }

    .footer-nav {
      align-items: flex-start;
    }

    .footer-bottom-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
`

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const currentYear = new Date().getFullYear()

  const payload = await getPayload({ config: configPromise })
  const pagesResult = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 20,
    overrideAccess: false,
    where: { slug: { not_equals: 'home' } },
    select: { title: true, slug: true },
  })
  const publishedPages = pagesResult.docs

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />
      <footer className="footer-root">
        <div className="footer-top">
          <div className="footer-top-inner">

            {/* Left: Logo + meta */}
            <div className="footer-brand">
              <Link className="footer-logo-link" href="/">
                <Logo />
              </Link>
              <div className="footer-meta">
                <p className="footer-tagline">Fighting for you. Every day.</p>
                <p className="footer-disclaimer">
                  Paid for and authorized by the campaign committee.
                </p>
              </div>
            </div>

            {/* Right: Nav */}
            {(navItems.length > 0 || publishedPages.length > 0) && (
              <div className="footer-nav-section">
                <p className="footer-nav-label">Quick Links</p>
                <nav>
                  <ul className="footer-nav">
                    {publishedPages.map((page) => (
                      <li key={page.id}>
                        <Link className="footer-nav-link" href={`/${page.slug}`}>
                          {page.title}
                        </Link>
                      </li>
                    ))}
                    {navItems.map(({ link }, i) => (
                      <li key={`nav-${i}`}>
                        <CMSLink className="footer-nav-link" {...link} />
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="footer-legal">
              © {currentYear} Campaign Committee. All rights reserved.
              <span className="footer-pipe">|</span>
              <Link href="/privacy">Privacy Policy</Link>
              <span className="footer-pipe">|</span>
              <Link href="/terms">Terms</Link>
              <span className="footer-pipe">|</span>
              <Link href="/accessibility">Accessibility</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}