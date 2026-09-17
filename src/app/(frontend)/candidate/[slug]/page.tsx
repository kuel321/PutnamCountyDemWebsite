import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { pointOnFeature } from '@turf/turf'
import type { Polygon, MultiPolygon } from 'geojson'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveHref } from '@/components/Header/resolveHref'
import { SocialIcon, socialLinkLabel } from '@/components/SocialIcon'
import { DistrictPreviewMap } from '@/components/DistrictPreviewMap'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { getGlobal } from '@/utilities/getGlobals'

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

  const [result, candidatePages] = await Promise.all([
    payload.find({
      collection: 'candidates',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
    }),
    getGlobal('candidatePages', 1),
  ])

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

  let labelPosition: [number, number] | null = null
  if (district?.boundary) {
    try {
      const [lon, lat] = pointOnFeature(
        district.boundary as unknown as Polygon | MultiPolygon,
      ).geometry.coordinates
      labelPosition = [lat, lon]
    } catch {
      labelPosition = null
    }
  }

  return (
    <>
      <section className="relative min-h-[22rem] overflow-hidden bg-brand-navy sm:min-h-[28rem]">
        {district?.boundary && (
          <DistrictPreviewMap
            boundary={district.boundary as Record<string, unknown>}
            label={district.title}
            districtNumber={district.number ?? null}
            labelPosition={labelPosition}
            className="absolute inset-0"
          />
        )}

        {/* Scrim so the centered text stays readable regardless of what the map is doing behind it. */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/70 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            {headshot && (
              <img
                src={getMediaUrl(headshot.url)}
                alt={headshot.alt || candidate.title}
                className="h-32 w-32 shrink-0 rounded-full object-cover sm:h-40 sm:w-40"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{candidate.title}</h1>
              <p className="mt-2 text-white/70">
                {typeLabels[candidate.type] ?? candidate.type}
                {district && ` · ${district.title}`}
              </p>

              {candidate.links && candidate.links.length > 0 && (
                <div className="mt-4 flex justify-center gap-3">
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

      <RenderBlocks blocks={candidatePages.layout} />
      <RenderBlocks blocks={candidate.layout} />
    </>
  )
}
