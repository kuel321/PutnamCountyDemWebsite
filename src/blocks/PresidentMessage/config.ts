import type { Block } from 'payload'

import { anchorIdField } from '@/fields/anchorId'

export const PresidentMessage: Block = {
  slug: 'presidentMessage',
  interfaceName: 'PresidentMessageBlock',
  labels: {
    singular: "President's Message",
    plural: "President's Message Blocks",
  },
  fields: [anchorIdField],
}
