import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveHref } from '@/components/Header/resolveHref'
import { SocialIcon, socialLinkLabel } from '@/components/SocialIcon'

type CandidatePageProps = {
  params: Promise<{ slug: string }>
}

const typeLabels: Record<string, string> = {
  'federal-state': 'Federal / State',
  'putnam-county': 'Putnam County',
}

function PhotoGrid({ images }: { images: { image: Media; id?: string | null }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((item, index) => (
        <img
          key={item.id ?? index}
          src={getMediaUrl(item.image.url)}
          alt={item.image.alt || ''}
          className="w-full rounded-md"
        />
      ))}
    </div>
  )
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'candidates',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const candidate = result.docs[0]
  if (!candidate) {
    notFound()
  }

  const district =
    candidate.district && typeof candidate.district === 'object' ? candidate.district : null
  const headshot =
    candidate.headshot && typeof candidate.headshot === 'object' ? candidate.headshot : null

  const photos = (candidate.photos ?? []).filter(
    (item): item is { image: Media; id?: string | null } =>
      Boolean(item.image) && typeof item.image === 'object',
  )
  const ads = (candidate.gallery ?? []).filter(
    (item): item is { image: Media; id?: string | null } =>
      Boolean(item.image) && typeof item.image === 'object',
  )

  return (
    <>
      <section className="bg-brand-navy px-6 py-12 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          {headshot && (
            <img
              src={getMediaUrl(headshot.url)}
              alt={headshot.alt || candidate.title}
              className="h-32 w-32 shrink-0 rounded-full border-4 border-white/20 object-cover sm:h-40 sm:w-40"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{candidate.title}</h1>
            <p className="mt-2 text-white/70">
              {typeLabels[candidate.type] ?? candidate.type}
              {district && ` · ${district.title}`}
            </p>

            {candidate.links && candidate.links.length > 0 && (
              <div className="mt-4 flex justify-center gap-3 sm:justify-start">
                {candidate.links.map((item, index) => {
                  const href = resolveHref(item.link)
                  if (!href) return null

                  return (
                    <a
                      key={item.id ?? index}
                      href={href}
                      target={item.link.newTab ? '_blank' : undefined}
                      rel={item.link.newTab ? 'noopener noreferrer' : undefined}
                      aria-label={item.link.label || socialLinkLabel(href)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                      <SocialIcon url={href} className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {candidate.content && (
            <RichText
              data={candidate.content}
              className="prose prose-xl max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
            />
          )}
        </div>
      </section>

      {photos.length > 0 && (
        <section className="bg-gray-50 px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-brand-navy">Photos</h2>
            <div className="mt-6">
              <PhotoGrid images={photos} />
            </div>
          </div>
        </section>
      )}

      {ads.length > 0 && (
        <section className="px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-brand-navy">Campaign Ads</h2>
            <div className="mt-6">
              <PhotoGrid images={ads} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
