import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { slugField } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Candidates: CollectionConfig = {
  slug: 'candidates',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Candidates',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'district', 'slug'],
  },
  defaultSort: 'title',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Candidate Name',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'putnam-county',
      options: [
        {
          label: 'Federal / State',
          value: 'federal-state',
        },
        {
          label: 'Putnam Co.',
          value: 'putnam-county',
        },
      ],
    },
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      admin: {
        description: 'Putnam Co. voting district this candidate is running in.',
        condition: (_, siblingData) => siblingData?.type === 'putnam-county',
      },
    },
    {
      name: 'office',
      type: 'text',
      label: 'Office / Race',
      admin: {
        description: 'e.g. "US Senate Candidate" or "WV House of Representatives - District 21".',
      },
    },
    {
      name: 'headshot',
      type: 'upload',
      relationTo: 'media',
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
    linkGroup({
      overrides: {
        admin: {
          description: 'Website / Facebook page links.',
        },
      },
    }),
    {
      name: 'photos',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'General photos of this candidate (e.g. from events), shown on their profile page.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        initCollapsed: true,
        description:
          'Candidate ad images, used for the home page ads spotlight carousel and shown on their profile page.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    slugField(),
  ],
}
