import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import {
  revalidateMeetingContent,
  revalidateMeetingContentDelete,
} from '../hooks/revalidateMeetingContent'

export const MeetingMinutes: CollectionConfig = {
  slug: 'meeting-minutes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: 'Meetings',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'meeting', '_status'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateMeetingContent],
    afterDelete: [revalidateMeetingContentDelete],
  },
  defaultSort: '-date',
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
      name: 'meeting',
      type: 'relationship',
      relationTo: 'meetings',
      admin: {
        description: 'Optionally link these minutes to the meeting they summarize.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The original PDF or Word document, if one was submitted.',
      },
    },
  ],
}
