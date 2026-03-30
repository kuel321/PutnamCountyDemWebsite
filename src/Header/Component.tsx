import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  const payload = await getPayload({ config: configPromise })
  const pagesResult = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 20,
    overrideAccess: false,
    where: { slug: { not_equals: 'home' } },
    select: { title: true, slug: true },
  })

  return <HeaderClient data={headerData} pages={pagesResult.docs} />
}
