import config from '@payload-config'
import { getPayload } from 'payload'

import { RichText } from '@/components/RichText'

import { AutoCarousel } from './AutoCarousel'

export async function NewsReel() {
  const payload = await getPayload({ config })

  const { docs: highlights } = await payload.find({
    collection: 'highlights',
    sort: 'order',
    limit: 20,
  })

  if (highlights.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold text-brand-navy sm:text-2xl">News Reel & Highlights</h2>
      <div className="mt-4">
        <AutoCarousel
          intervalMs={7000}
          items={highlights.map((highlight) => (
            <div key={highlight.id}>
              <p className="font-medium text-gray-900">{highlight.title}</p>
              {highlight.content && (
                <RichText
                  data={highlight.content}
                  className="prose mt-1 max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
                />
              )}
            </div>
          ))}
        />
      </div>
    </div>
  )
}
