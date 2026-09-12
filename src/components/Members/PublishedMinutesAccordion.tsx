import config from '@payload-config'
import { getPayload } from 'payload'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export async function PublishedMinutesAccordion() {
  const payload = await getPayload({ config })

  const { docs: minutes } = await payload.find({
    collection: 'meeting-minutes',
    sort: '-date',
    limit: 100,
    depth: 2,
    overrideAccess: false,
  })

  if (minutes.length === 0) {
    return <p className="mt-4 text-gray-500">No approved meeting minutes have been posted yet.</p>
  }

  return (
    <div className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
      {minutes.map((entry) => {
        const meeting = entry.meeting && typeof entry.meeting === 'object' ? entry.meeting : null
        const photos = (meeting?.photos ?? []).filter(
          (photo): photo is { image: Media; id?: string | null } =>
            Boolean(photo.image) && typeof photo.image === 'object',
        )

        return (
          <details key={entry.id} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{entry.title}</p>
                <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
              </div>
              <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-180">
                &#9662;
              </span>
            </summary>

            <div className="mt-4 border-t border-gray-100 pt-4">
              {entry.content && (
                <RichText
                  data={entry.content}
                  className="prose prose-sm max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
                />
              )}
              {entry.file && typeof entry.file === 'object' && (
                <a
                  href={getMediaUrl(entry.file.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-brand-red hover:underline"
                >
                  View original file
                </a>
              )}

              {meeting?.location && (
                <p className="mt-4 text-sm text-gray-500">Location: {meeting.location}</p>
              )}

              {photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <img
                      key={photo.id ?? index}
                      src={getMediaUrl(photo.image.url)}
                      alt={photo.image.alt || `${meeting?.title ?? entry.title} photo`}
                      className="h-20 w-20 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </details>
        )
      })}
    </div>
  )
}
