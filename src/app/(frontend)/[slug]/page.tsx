import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Breadcrumb } from '@/components/Breadcrumb'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { autoDescriptionFromBlocks, autoImageFromBlocks, SITE_FALLBACK_IMAGE } from '@/utilities/autoSEO'

type PageProps = {
  params: Promise<{ slug: string }>
}

// cache() dedupes this so generateMetadata and the page component share one
// query per request instead of hitting the db twice.
const getPageBySlug = cache(async (slug: string, draft: boolean) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    depth: 2,
  })
  return result.docs[0] ?? null
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug(slug, draft)
  if (!page) return {}

  // Most pages never get their manual SEO tab filled in — fall back to
  // generating a reasonable title/description/image from the page's own
  // content blocks instead of shipping empty meta tags.
  const title = page.meta?.title || page.title
  const description = page.meta?.description || autoDescriptionFromBlocks(page.layout) || undefined

  const metaImage = page.meta?.image && typeof page.meta.image === 'object' ? page.meta.image : null
  const image = metaImage || autoImageFromBlocks(page.layout)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image
        ? [
            {
              url: getMediaUrl(image.url),
              width: image.width ?? undefined,
              height: image.height ?? undefined,
              alt: image.alt || title,
            },
          ]
        : [{ url: SITE_FALLBACK_IMAGE, alt: title }],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug(slug, draft)

  if (!page) {
    notFound()
  }

  return (
    <>
      <section className="bg-brand-navy px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: page.title }]} className="mb-3" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{page.title}</h1>
        </div>
      </section>

      <RenderBlocks blocks={page.layout} />
    </>
  )
}
