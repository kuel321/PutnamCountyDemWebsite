import type { Block } from 'payload'

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
  ],
}
