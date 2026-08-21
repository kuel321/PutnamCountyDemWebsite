import React from 'react'

import { Header } from '@/components/Header'
import { getCachedGlobal } from '@/utilities/getGlobals'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerData = await getCachedGlobal('header', 1)()

  return (
    <html lang="en">
      <body>
        <Header data={headerData} />
        {children}
      </body>
    </html>
  )
}
