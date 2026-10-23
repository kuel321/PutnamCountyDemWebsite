import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const PARTY_OPTIONS = [
  { label: 'Democratic (DEM)', value: 'DEM' },
  { label: 'Republican (REP)', value: 'REP' },
  { label: 'Libertarian (LBN)', value: 'LBN' },
  { label: 'Mountain (MTN)', value: 'MTN' },
  { label: 'Constitution (CST)', value: 'CST' },
]

export const TICKET_OPTIONS = [
  { label: 'National Ticket', value: 'national' },
  { label: 'State Ticket', value: 'state' },
  { label: 'Judicial (Nonpartisan)', value: 'judicial' },
  { label: 'County Ticket', value: 'county' },
  { label: 'Constitutional Amendment', value: 'amendment' },
  { label: 'Town / City Ballot', value: 'municipal' },
]

export const BallotRaces: CollectionConfig = {
  slug: 'ballot-races',
  labels: {
    singular: 'Ballot Race',
    plural: 'Ballot Races',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Sample Ballot',
    useAsTitle: 'office',
    defaultColumns: ['office', 'subtitle', 'ticket', 'order'],
    description:
      'Every race and question on the sample ballot. The Sample Ballot block shows them in "Order" sequence.',
  },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'office',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'e.g. "U.S. Senator", "Mayor", "Amendment No. 1".',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. "1st Congressional District", "Town of Buffalo", "Unexpired Term".',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ticket',
          type: 'select',
          required: true,
          options: TICKET_OPTIONS,
          admin: { width: '33%' },
        },
        {
          name: 'voteFor',
          type: 'number',
          label: 'Vote For',
          defaultValue: 1,
          admin: {
            width: '33%',
            description: 'How many choices a voter may pick.',
          },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '33%',
            description: 'Lower numbers appear higher on the ballot.',
          },
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description:
          'Optional fine print shown under the race — e.g. "Not more than one resident of any magisterial district may be elected", or an amendment\'s Summary of Purpose.',
      },
    },
    {
      name: 'ballotStyles',
      type: 'relationship',
      relationTo: 'ballot-styles',
      hasMany: true,
      label: 'Appears On',
      admin: {
        description:
          'Which ballot styles include this race. Leave EMPTY if it appears on every ballot in the county.',
      },
    },
    {
      name: 'choices',
      type: 'array',
      labels: {
        singular: 'Choice',
        plural: 'Choices',
      },
      admin: {
        description:
          'Candidates (or "For" / "Against" for an amendment), in ballot order. No need to add "No candidate nominated" or write-in lines.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'party',
              type: 'select',
              options: PARTY_OPTIONS,
              admin: {
                width: '25%',
                description: 'Leave blank for nonpartisan races.',
              },
            },
            {
              name: 'hometown',
              type: 'text',
              admin: { width: '35%', description: 'e.g. "Charleston, Kanawha Co."' },
            },
          ],
        },
        {
          name: 'candidate',
          type: 'relationship',
          relationTo: 'candidates',
          label: 'Link to Candidate Profile (optional)',
          admin: {
            description: 'Pick one of our candidates to show a "View profile" link on the ballot.',
          },
        },
      ],
    },
  ],
}
