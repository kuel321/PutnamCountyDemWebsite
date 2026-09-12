import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const PresidentMessages: CollectionConfig = {
  slug: 'president-messages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'displayDate', 'archiveDate', 'placement'],
    description:
      'Messages from the club president. Only the most recent one currently in its active window (display date reached, archive date not yet passed) is shown.',
  },
  defaultSort: '-displayDate',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'A Message from the President',
      admin: {
        description: 'Shown as the banner heading. Only used internally if left generic.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: "Name and photo come from this person's user profile.",
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'displayDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
        description: 'This message becomes active on this date.',
      },
    },
    {
      name: 'archiveDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
        description:
          'Optional. This message stops showing after this date. Leave blank to let it keep showing until a newer message supersedes it.',
      },
    },
    {
      name: 'placement',
      type: 'select',
      required: true,
      defaultValue: 'sitewide',
      options: [
        { label: 'Site-wide banner (every page)', value: 'sitewide' },
        { label: 'Only where added as a block', value: 'block' },
      ],
      admin: {
        description:
          'Site-wide shows this as a banner on every page. "Only where added as a block" only shows it on pages where a President\'s Message block has been manually added.',
      },
    },
  ],
}
