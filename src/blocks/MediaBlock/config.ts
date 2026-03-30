import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Max Width',
      defaultValue: 'full',
      options: [
        { label: 'Full', value: 'full' },
        { label: 'Extra Large (1200px)', value: 'xl' },
        { label: 'Large (900px)', value: 'lg' },
        { label: 'Medium (600px)', value: 'md' },
        { label: 'Small (400px)', value: 'sm' },
      ],
    },
  ],
}
