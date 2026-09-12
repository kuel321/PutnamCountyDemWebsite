import { getActivePresidentMessage } from '@/utilities/getActivePresidentMessage'
import { PresidentMessageBanner } from '@/components/PresidentMessageBanner'

export async function PresidentMessageBlock() {
  const presidentMessage = await getActivePresidentMessage()

  // Site-wide messages are already shown globally in the root layout — skip
  // here so a page with this block doesn't show the message twice.
  if (!presidentMessage || presidentMessage.placement !== 'block') return null

  return <PresidentMessageBanner presidentMessage={presidentMessage} />
}
