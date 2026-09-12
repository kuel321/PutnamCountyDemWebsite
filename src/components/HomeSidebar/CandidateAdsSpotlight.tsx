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
        candidateSlug: candidate.slug,
        image: item.image,
      })),
  )

  if (ads.length === 0) return null

  return (
    <AutoCarousel
      intervalMs={5000}
      items={ads.map((ad, index) => (
        <a
          key={`${ad.candidateTitle}-${index}`}
          href={`/candidate/${ad.candidateSlug}`}
          className="group relative block cursor-pointer overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-lg"
        >
          <img
            src={getMediaUrl(ad.image.url)}
            alt={ad.image.alt || `${ad.candidateTitle} campaign ad`}
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-navy/70 via-brand-navy/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-lg">
              <svg
                className="h-6 w-6 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </a>
      ))}
    />
  )
}
