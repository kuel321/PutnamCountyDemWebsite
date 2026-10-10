import type { Block } from 'payload'

import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { anchorIdField } from '@/fields/anchorId'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  labels: {
    singular: 'Numbered Accordion',
    plural: 'Numbered Accordion Blocks',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
            },
          }),
          admin: {
            description:
              "* A \"Read more\" link appears automatically once this runs long (roughly 150+ characters) — short entries show in full with no link, so there's nothing to configure here.",
          },
        },
        anchorIdField,
      ],
    },
    anchorIdField,
  ],
}
