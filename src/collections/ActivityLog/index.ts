import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ActivityLog: CollectionConfig = {
  slug: 'activity-log',
  labels: {
    singular: 'Activity Log Entry',
    plural: 'Activity Log',
  },
  admin: {
    group: 'Admin',
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'actor', 'action', 'createdAt'],
    description:
      'Automatic record of who changed what, and when. Written by the system — nothing here is entered by hand.',
  },
  access: {
    // Entries are only ever written by the system (via hooks, which use the
    // local API and bypass access control) — nobody should create, edit, or
    // remove them by hand.
    create: () => false,
    read: authenticated,
    update: () => false,
    delete: () => false,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'summary',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'actor',
      label: 'Who',
      type: 'relationship',
      relationTo: ['users', 'club-members'],
      admin: { readOnly: true },
    },
    {
      name: 'action',
      label: 'What Happened',
      type: 'select',
      options: [
        { label: 'Created', value: 'create' },
        { label: 'Updated', value: 'update' },
        { label: 'Deleted', value: 'delete' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'area',
      label: 'Area',
      type: 'text',
      admin: { readOnly: true, description: 'Which collection or setting this happened in.' },
    },
    {
      name: 'item',
      label: 'Item',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
