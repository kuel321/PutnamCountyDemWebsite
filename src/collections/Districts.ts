import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Districts: CollectionConfig = {
  slug: 'districts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Candidates',
    useAsTitle: 'title',
    defaultColumns: ['title', 'number'],
  },
  defaultSort: 'number',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name, e.g. "District 3".',
      },
    },
    {
      name: 'number',
      type: 'number',
      admin: {
        description: 'Used for sorting districts numerically.',
      },
    },
    {
      name: 'boundary',
      type: 'json',
      admin: {
        description:
          'Placeholder for GeoJSON boundary data once real district shapes are available.',
      },
    },
  ],
}
