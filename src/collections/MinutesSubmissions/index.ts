import type { Access, CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { publishOnApproval } from './hooks/publishOnApproval'
import { setSubmitter } from './hooks/setSubmitter'

const createByClubMember: Access = ({ req }) => req.user?.collection === 'club-members'

const readOwnOrAdmin: Access = ({ req }) => {
  if (req.user?.collection === 'users') return true
  if (req.user?.collection === 'club-members') {
    return {
      submittedBy: {
        equals: req.user.id,
      },
    }
  }
  return false
}

export const MinutesSubmissions: CollectionConfig = {
  slug: 'minutes-submissions',
  access: {
    create: createByClubMember,
    delete: adminOnly,
    read: readOwnOrAdmin,
    update: adminOnly,
  },
  admin: {
    group: 'Club Members',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status', 'submittedBy'],
    description: 'Draft meeting minutes submitted by club members, pending staff approval.',
  },
  defaultSort: '-createdAt',
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
      name: 'meeting',
      type: 'relationship',
      relationTo: 'meetings',
      admin: {
        description: 'Optionally link these minutes to the meeting they summarize.',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload the meeting minutes as a PDF or Word document.',
      },
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'club-members',
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: adminOnly,
        update: adminOnly,
      },
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      access: {
        create: () => false,
        update: adminOnly,
      },
      admin: {
        description: 'Visible to staff only — notes for the submitter, e.g. why it was rejected.',
      },
    },
    {
      name: 'publishedMinutes',
      type: 'relationship',
      relationTo: 'meeting-minutes',
      access: {
        create: () => false,
        update: adminOnly,
      },
      admin: {
        readOnly: true,
        description: 'Set automatically when this submission is approved.',
      },
    },
  ],
  hooks: {
    beforeChange: [setSubmitter],
    afterChange: [publishOnApproval],
  },
  timestamps: true,
}
