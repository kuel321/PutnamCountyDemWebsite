import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export function isPdfMedia(media: Media): boolean {
  return media.mimeType === 'application/pdf'
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// Used anywhere a block would otherwise put an image straight into an <img>
// tag — a PDF selected in that same field can't render that way, so this
// shows a document card (icon + filename + link) instead.
export function MediaThumbnail({ media, className }: { media: Media; className?: string }) {
  if (isPdfMedia(media)) {
    return (
      <a
        href={getMediaUrl(media.url)}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 ${className ?? ''}`}
      >
        <PdfIcon className="h-10 w-10 shrink-0 text-brand-red" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-navy">
            {media.filename || 'PDF document'}
          </p>
          <p className="text-xs text-gray-500">View PDF</p>
        </div>
      </a>
    )
  }

  return (
    <img
      src={getMediaUrl(media.url)}
      alt={media.alt || ''}
      width={media.width || undefined}
      height={media.height || undefined}
      className={className}
    />
  )
}
