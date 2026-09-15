import { RichText } from '@payloadcms/richtext-lexical/react'

import type { MediaContentBlock as MediaContentBlockProps } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export function MediaContentBlock({ media, externalLink, content }: MediaContentBlockProps) {
  const image = media && typeof media === 'object' ? media : null
  if (!image) return null

  const photo = (
    <img
      src={getMediaUrl(image.url)}
      alt={image.alt || ''}
      className="w-full rounded-lg object-cover"
    />
  )

  return (
    <section className="px-6 py-10 sm:py-12">
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          {externalLink ? (
            <a href={externalLink} target="_blank" rel="noopener noreferrer">
              {photo}
            </a>
          ) : (
            photo
          )}
        </div>

        {content && (
          <div>
            <RichText
              data={content}
              className="prose max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
            />
          </div>
        )}
      </div>
    </section>
  )
}
