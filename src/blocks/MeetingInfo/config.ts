import type { Block } from 'payload'

import { anchorIdField } from '@/fields/anchorId'

export const MeetingInfo: Block = {
  slug: 'meetingInfo',
  interfaceName: 'MeetingInfoBlock',
  labels: {
    singular: 'Meeting Info',
    plural: 'Meeting Info Blocks',
  },
  fields: [anchorIdField],
}
