import { getActivePresidentMessage } from '@/utilities/getActivePresidentMessage'
import { PresidentMessageBanner } from '@/components/PresidentMessageBanner'

import type { PresidentMessageBlock as PresidentMessageBlockProps } from '@/payload-types'

export async function PresidentMessageBlock({ anchorId }: PresidentMessageBlockProps) {
  const presidentMessage = await getActivePresidentMessage()

  // Site-wide messages are already shown globally in the root layout — skip
  // here so a page with this block doesn't show the message twice.
  if (!presidentMessage || presidentMessage.placement !== 'block') return null

  return (
    <div id={anchorId || undefined} className="scroll-mt-24">
      <PresidentMessageBanner presidentMessage={presidentMessage} />
    </div>
  )
}
