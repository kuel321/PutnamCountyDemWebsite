import type { CollectionConfig } from 'payload'

import { adminOnly } from '../access/adminOnly'

export const TreasuryReports: CollectionConfig = {
  slug: 'treasury-reports',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    group: 'Treasury',
    useAsTitle: 'title',
    defaultColumns: ['title', 'fiscalYear', 'period', 'date'],
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'fiscalYear',
      type: 'number',
      label: 'Fiscal Year',
    },
    {
      name: 'period',
      type: 'select',
      label: 'Period',
      options: [
        { label: 'Q1', value: 'q1' },
        { label: 'Q2', value: 'q2' },
        { label: 'Q3', value: 'q3' },
        { label: 'Q4', value: 'q4' },
        { label: 'Annual', value: 'annual' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Description / Notes',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The Excel (.xlsx) report file.',
      },
    },
  ],
  timestamps: true,
}
