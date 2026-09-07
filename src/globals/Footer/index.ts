import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Site-wide',
  },
  access: {
    // Anyone can read the footer — the public site needs it to render.
    read: anyone,
    // Only logged-in admins can change it.
    update: authenticated,
  },
  fields: [
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'chasingAChanceUrl',
      type: 'text',
      label: 'Chasing a Chance Link',
      defaultValue: 'https://chasingachance.com',
      admin: {
        description: 'Where the "Site by Chasing a Chance" credit in the footer corner links to.',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X (Twitter)', value: 'twitter' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
