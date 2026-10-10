import type { Block } from 'payload'

import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { anchorIdField } from '@/fields/anchorId'

export const NumberedList: Block = {
  slug: 'numberedList',
  interfaceName: 'NumberedListBlock',
  labels: {
    singular: 'Numbered List',
    plural: 'Numbered List Blocks',
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
        },
        {
          name: 'anchorId',
          type: 'text',
          label: 'Read More Target (optional)',
          admin: {
            description:
              'If set, this item shows a "Read more" link that jumps to that anchor elsewhere on this page — e.g. a Content block further down whose own Anchor ID field is set to the same value. Leave blank to show this item with no link.',
          },
        },
      ],
    },
    anchorIdField,
  ],
}
