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
            className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="px-4 text-xl font-bold text-white sm:text-2xl">{ad.candidateTitle}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
              View Candidate
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
