import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const MediaContent: Block = {
  slug: 'mediaContent',
  interfaceName: 'MediaContentBlock',
  labels: {
    singular: 'Media + Content (Side-by-Side)',
    plural: 'Media + Content (Side-by-Side) Blocks',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Click into this field and paste (Ctrl+V / Cmd+V) an image copied from Facebook or another site to upload it directly — no trip to the Media Library required. Drag-and-drop and browsing existing media still work as usual. A PDF can be uploaded here too — it will show as a downloadable document instead of a photo.',
        components: {
          Field: '@/blocks/MediaContent/PasteImageField',
        },
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'Link back to original post',
      admin: {
        description:
          "If this photo/ad is from Facebook, Instagram, etc., paste the original post's URL here to make the image clickable back to the source.",
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
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
  ],
}
