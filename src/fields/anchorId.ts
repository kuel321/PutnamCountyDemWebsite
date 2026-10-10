import type { Field } from 'payload'

/**
 * Shared across every content block so any block on the site can be
 * deep-linked to directly, e.g. putnamdemswv.com/our-party#history.
 * Rendered as the `id` attribute on that block's wrapper element.
 */
export const anchorIdField: Field = {
  name: 'anchorId',
  type: 'text',
  label: 'Anchor ID (optional)',
  admin: {
    description:
      'Lets you link directly to this block, e.g. an anchor ID of "history" makes this block reachable at .../page-slug#history. Letters, numbers, and hyphens only — no spaces.',
  },
}
