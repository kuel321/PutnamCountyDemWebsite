import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateMeetingContent,
  revalidateMeetingContentDelete,
} from '../hooks/revalidateMeetingContent'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Meetings',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'time', 'location'],
  },
  hooks: {
    afterChange: [revalidateMeetingContent],
    afterDelete: [revalidateMeetingContentDelete],
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
    {
      name: 'photos',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Photos from this meeting, shown alongside its listing.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'hideFromPublic',
          type: 'checkbox',
          defaultValue: false,
          label: "Don't show on public page",
          admin: {
            description:
              'When checked, this photo is only visible to logged-in club members, not on the public Meeting Dates & Location page.',
          },
        },
      ],
    },
  ],
}
