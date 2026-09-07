import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { blockDisabledLogin } from './hooks/blockDisabledLogin'

export const ClubMembers: CollectionConfig = {
  slug: 'club-members',
  auth: true,
  access: {
    admin: () => false,
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    group: 'Club Members',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'enabled'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Access Enabled',
      admin: {
        description:
          'Uncheck to block this member from logging into the members-only area without deleting their account.',
      },
    },
  ],
  hooks: {
    beforeLogin: [blockDisabledLogin],
  },
  timestamps: true,
}
