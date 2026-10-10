import type { Block } from 'payload'

import { anchorIdField } from '@/fields/anchorId'

export const Candidates: Block = {
  slug: 'candidates',
  interfaceName: 'CandidatesBlock',
  labels: {
    singular: 'Candidates',
    plural: 'Candidates Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Meet Our Candidates',
    },
    anchorIdField,
  ],
}
