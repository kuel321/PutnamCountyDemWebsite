import type { Field } from 'payload'

/**
 * Shared across every block, collection, and repeating array item on the
 * site so any of them can be deep-linked to directly, e.g.
 * putnamdemswv.com/our-party#history. Rendered as the `id` attribute on
 * that item's wrapper element (falling back to an auto-generated id where
 * one already exists, e.g. meeting-${meeting.id}).
 */
export const anchorIdField: Field = {
  name: 'anchorId',
  type: 'text',
  label: 'Anchor ID (optional)',
  admin: {
    description:
      'Lets you link directly to this — e.g. an anchor ID of "history" makes it reachable at .../page-slug#history. Letters, numbers, and hyphens only — no spaces.',
  },
}
