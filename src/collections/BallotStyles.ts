import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const BallotStyles: CollectionConfig = {
  slug: 'ballot-styles',
  labels: {
    singular: 'Ballot Style',
    plural: 'Ballot Styles',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Sample Ballot',
    useAsTitle: 'name',
    defaultColumns: ['name', 'precincts', 'order'],
    description:
      'One entry per version of the county ballot — the county prints a different ballot for each group of precincts.',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Shown in the precinct picker, e.g. "Precinct 1 & Town of Buffalo".',
      },
    },
    {
      name: 'precincts',
      type: 'text',
      required: true,
      admin: {
        description:
          'Precinct numbers on this ballot, separated by commas (e.g. "2, 4, 14"). Visitors typing their precinct number are matched against this.',
      },
    },
    {
      name: 'officialBallotUrl',
      type: 'text',
      label: 'Official Sample Ballot (PDF link)',
      admin: {
        description: "Link to the County Clerk's PDF of this ballot.",
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in the precinct picker.',
      },
    },
  ],
}
