import type { Block } from 'payload'

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter Signup', plural: 'Newsletter Signups' },
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
      required: true,
      defaultValue: 'Stay in the Loop',
    },
    {
      name: 'subtext',
      type: 'text',
      label: 'Subtext',
      defaultValue: 'Get updates from the campaign delivered straight to your inbox.',
    },
    {
      name: 'placeholder',
      type: 'text',
      label: 'Input Placeholder',
      defaultValue: 'Your email address',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
      defaultValue: 'Sign Up',
    },
    {
      name: 'successMessage',
      type: 'text',
      label: 'Success Message',
      defaultValue: "You're on the list — thank you!",
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Payload Form',
      admin: {
        description:
          'Create a form in the Forms admin with a single Email field, then link it here. Submissions will appear under Form Submissions.',
      },
    },
  ],
}
