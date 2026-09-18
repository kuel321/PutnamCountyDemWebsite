import type { Block } from 'payload'

export const MediaGrid: Block = {
  slug: 'mediaGrid',
  interfaceName: 'MediaGridBlock',
  labels: {
    singular: 'Photo Grid (3-Wide)',
    plural: 'Photo Grid (3-Wide) Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Photo',
        plural: 'Photos',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description:
              'Click into this field and paste (Ctrl+V / Cmd+V) an image to upload it directly — no trip to the Media Library required. Drag-and-drop and browsing existing media still work as usual.',
            components: {
              Field: '@/blocks/MediaContent/PasteImageField',
            },
          },
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'credit',
          type: 'text',
          label: 'Courtesy of',
          admin: {
            description:
              'Optional photo credit. Shown as a small label overlaid on the bottom-right corner of the image (e.g. "Jane Doe" or "Putnam County GOP").',
          },
        },
      ],
    },
  ],
}
