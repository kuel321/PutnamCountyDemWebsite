import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [pages, candidates] = await Promise.all([
    payload.find({
      collection: 'pages',
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'candidates',
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  // Pages collection uses 'home' as the slug for the root path (see revalidatePage hook)
  const pageEntries = pages.docs
    .filter((page) => page.slug)
    .map((page) => ({
      url: page.slug === 'home' ? SITE_URL : `${SITE_URL}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
    }))

  const candidateEntries = candidates.docs
    .filter((candidate) => candidate.slug)
    .map((candidate) => ({
      url: `${SITE_URL}/candidate/${candidate.slug}`,
      lastModified: candidate.updatedAt ? new Date(candidate.updatedAt) : undefined,
    }))

  const hasHomePage = pageEntries.some((entry) => entry.url === SITE_URL)

  return [
    ...(hasHomePage ? [] : [{ url: SITE_URL, lastModified: new Date() }]),
    ...pageEntries,
    ...candidateEntries,
  ]
}
