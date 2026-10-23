import type { Block } from 'payload'

import { anchorIdField } from '@/fields/anchorId'

export const SampleBallot: Block = {
  slug: 'sampleBallot',
  interfaceName: 'SampleBallotBlock',
  labels: {
    singular: 'Sample Ballot',
    plural: 'Sample Ballot Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Your Sample Ballot',
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Short text shown above the precinct picker.',
      },
    },
    {
      name: 'precinctLookupUrl',
      type: 'text',
      label: '"Find my precinct" link (optional)',
      admin: {
        description:
          'Where to send visitors who don\'t know their precinct number — e.g. the WV Secretary of State voter lookup page.',
      },
    },
    {
      type: 'ui',
      name: 'editingHint',
      admin: {
        components: {
          Field: '@/blocks/SampleBallot/AdminHint',
        },
      },
    },
    anchorIdField,
  ],
}
