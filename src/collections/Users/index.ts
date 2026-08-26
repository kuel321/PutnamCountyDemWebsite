import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { sendNewUserEmails } from './hooks/sendNewUserEmails'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Admin',
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [sendNewUserEmails],
  },
  timestamps: true,
}
