import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { navItem } from '@/fields/navItem'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    group: 'Site-wide',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [navItem()],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'donateButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
