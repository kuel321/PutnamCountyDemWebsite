import { getActivePresidentMessage } from '@/utilities/getActivePresidentMessage'

import { PresidentMessageBanner } from './index'

export async function SitewidePresidentMessageBanner() {
  const presidentMessage = await getActivePresidentMessage()

  if (!presidentMessage || presidentMessage.placement !== 'sitewide') return null

  return <PresidentMessageBanner presidentMessage={presidentMessage} />
}
