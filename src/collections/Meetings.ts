import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'time', 'location'],
  },
  defaultSort: 'date',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'time',
      type: 'text',
      admin: {
        description: 'Free text, e.g. "6:30pm" or "TBD". Leave blank for all-day items.',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
