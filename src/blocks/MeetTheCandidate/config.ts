import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const MeetTheCandidate: Block = {
  slug: 'meetTheCandidate',
  interfaceName: 'MeetTheCandidateBlock',
  labels: {
    singular: 'Meet the Candidate',
    plural: 'Meet the Candidate Blocks',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Candidate Photo',
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Label',
      defaultValue: 'Meet',
      admin: {
        description: 'Small label above the name (e.g. "Meet")',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Candidate Name',
    },
    {
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Bio / Body Text',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      label: 'CTA Links',
      maxRows: 3,
      fields: [
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'radio',
              options: [
                { label: 'Internal Page', value: 'reference' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'custom',
              admin: { layout: 'horizontal' },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
            },
          ],
        },
      ],
    },
    {
      name: 'imagePosition',
      type: 'radio',
      label: 'Image Side',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'left',
      admin: {
        layout: 'horizontal',
        description: 'Which side the photo appears on',
      },
    },
  ],
}