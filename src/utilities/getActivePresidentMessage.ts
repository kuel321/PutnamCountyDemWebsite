import config from '@payload-config'
import { getPayload } from 'payload'

import type { PresidentMessage } from '@/payload-types'

export async function getActivePresidentMessage(): Promise<PresidentMessage | null> {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const { docs } = await payload.find({
    collection: 'president-messages',
    depth: 2,
    limit: 1,
    sort: '-displayDate',
    where: {
      and: [
        { displayDate: { less_than_equal: now } },
        {
          or: [{ archiveDate: { exists: false } }, { archiveDate: { greater_than: now } }],
        },
      ],
    },
  })

  return docs[0] ?? null
}
