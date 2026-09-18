import React from 'react'
import type { Metadata } from 'next'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SitewidePresidentMessageBanner } from '@/components/PresidentMessageBanner/SitewideBanner'
import { getGlobal } from '@/utilities/getGlobals'

import './globals.css'

// Lets page-level metadata (e.g. candidate og:image) pass relative URLs and
// have Next resolve them against the right domain per environment, instead
// of each page having to build an absolute URL by hand.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [headerData, footerData] = await Promise.all([
    getGlobal('header', 1),
    getGlobal('footer', 0),
  ])

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header data={headerData} />
        <SitewidePresidentMessageBanner />
        <main className="flex-1">{children}</main>
        <Footer data={footerData} logo={headerData.logo} navItems={headerData.navItems} />
      </body>
    </html>
  )
}
