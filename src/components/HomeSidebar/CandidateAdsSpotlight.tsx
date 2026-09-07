import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { AutoCarousel } from './AutoCarousel'

export async function CandidateAdsSpotlight() {
  const payload = await getPayload({ config })

  const { docs: candidates } = await payload.find({
    collection: 'candidates',
    depth: 1,
    limit: 100,
  })

  const ads = candidates.flatMap((candidate) =>
    (candidate.gallery ?? [])
      .filter((item): item is { image: Media; id?: string | null } => Boolean(item.image))
      .map((item) => ({
        candidateTitle: candidate.title,
        image: item.image,
      })),
  )

  if (ads.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-brand-navy">Candidate Ads Spotlight</h3>
      <div className="mt-4">
        <AutoCarousel
          intervalMs={5000}
          items={ads.map((ad, index) => (
            <figure key={`${ad.candidateTitle}-${index}`}>
              <img
                src={getMediaUrl(ad.image.url)}
                alt={ad.image.alt || `${ad.candidateTitle} campaign ad`}
                className="aspect-video w-full rounded-md object-cover"
              />
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {ad.candidateTitle}
              </figcaption>
            </figure>
          ))}
        />
      </div>
    </div>
  )
}
