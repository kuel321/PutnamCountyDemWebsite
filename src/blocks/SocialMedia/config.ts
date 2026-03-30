import type { Block } from 'payload'

export const SocialMedia: Block = {
  slug: 'socialMedia',
  interfaceName: 'SocialMediaBlock',
  labels: { singular: 'Social Media', plural: 'Social Media Blocks' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Label',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Follow the Campaign',
    },
    {
      name: 'accounts',
      type: 'array',
      label: 'Social Accounts',
      minRows: 1,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'X / Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Website', value: 'website' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label (optional)',
          admin: { description: 'Overrides the default platform name, e.g. "@EdwardsForPutnam"' },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
  ],
}
