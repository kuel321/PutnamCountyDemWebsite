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
          'GeoJSON Polygon/MultiPolygon shape of this district, shown on candidate profile pages. Populated by scripts/build-district-boundaries.ts — re-run that after WV redistricts rather than editing this by hand.',
        readOnly: true,
      },
    },
  ],
}
