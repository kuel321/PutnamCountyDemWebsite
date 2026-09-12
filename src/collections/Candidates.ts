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
      name: 'gallery',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Candidate ad images, used for the home page ads spotlight carousel.',
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
