import type { MediaGridBlock as MediaGridBlockProps, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export function MediaGridBlock({ heading, items }: MediaGridBlockProps) {
  const photos = (items ?? []).filter(
    (item): item is typeof item & { media: Media } =>
      Boolean(item.media) && typeof item.media === 'object',
  )

  if (photos.length === 0) return null

  return (
    <section className="px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {heading && (
          <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">{heading}</h2>
        )}

        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-3 ${heading ? 'mt-8' : ''}`}>
          {photos.map((item, index) => (
            <figure key={item.id ?? index}>
              <img
                src={getMediaUrl(item.media.url)}
                alt={item.media.alt || ''}
                width={item.media.width || undefined}
                height={item.media.height || undefined}
                className="w-full"
              />
              {item.caption && (
                <figcaption className="mt-2 text-sm text-gray-500">{item.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
