import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

// Meetings and Meeting Minutes are displayed inside a Page's MeetingInfo
// block, rendered at request time. Pages has its own revalidation hook, but
// it only fires when a Page itself is saved — editing a Meeting or Meeting
// Minutes entry doesn't touch any Page document, so without this, those
// pages would keep serving stale content until something else happened to
// bust the cache.
export const revalidateMeetingContent: CollectionAfterChangeHook = ({ req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
}

export const revalidateMeetingContentDelete: CollectionAfterDeleteHook = ({ req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
}
