import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'

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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XP54HFWFGH"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XP54HFWFGH');`}
        </Script>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WBLV738T');`}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WBLV738T"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Header data={headerData} />
        <SitewidePresidentMessageBanner />
        <main className="flex-1">{children}</main>
        <Footer data={footerData} logo={headerData.logo} navItems={headerData.navItems} />
      </body>
    </html>
  )
}
