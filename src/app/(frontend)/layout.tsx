import React from 'react'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SitewidePresidentMessageBanner } from '@/components/PresidentMessageBanner/SitewideBanner'
import { getGlobal } from '@/utilities/getGlobals'

import './globals.css'

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
