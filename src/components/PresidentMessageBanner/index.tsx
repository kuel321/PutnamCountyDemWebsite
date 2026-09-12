import type { PresidentMessage } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function PresidentMessageBanner({ presidentMessage }: { presidentMessage: PresidentMessage }) {
  const author =
    presidentMessage.author && typeof presidentMessage.author === 'object'
      ? presidentMessage.author
      : null
  const image = author?.image && typeof author.image === 'object' ? author.image : null

  return (
    <div className="bg-brand-navy px-6 py-4 text-white">
      <div className="mx-auto flex max-w-6xl items-start gap-4">
        {image && (
          <img
            src={getMediaUrl(image.url)}
            alt={image.alt || author?.name || presidentMessage.title}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
            {presidentMessage.title}
            {author?.name ? ` — ${author.name}` : ''} &middot;{' '}
            {formatDate(presidentMessage.displayDate)}
          </p>
          <p className="mt-1 text-sm text-white/90">{presidentMessage.message}</p>
        </div>
      </div>
    </div>
  )
}
