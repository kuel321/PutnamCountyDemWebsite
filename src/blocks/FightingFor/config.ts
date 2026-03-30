import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FightingFor: Block = {
  slug: 'fightingFor',
  interfaceName: 'FightingForBlock',
  labels: {
    singular: 'Fighting For',
    plural: 'Fighting For Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Label',
      defaultValue: "What He's Fighting For",
      admin: {
        description: 'Small label above the heading',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Section Heading',
      defaultValue: 'The Issues That Matter',
    },
    {
      name: 'issues',
      type: 'array',
      label: 'Issues / Priorities',
      minRows: 1,
      maxRows: 9,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji or short symbol)',
          defaultValue: '★',
          admin: {
            description: 'Paste a single emoji or symbol, e.g. 💧 🏥 ⚒️',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Issue Title',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
