import type { CollectionBeforeChangeHook } from 'payload'

export const setSubmitter: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && req.user?.collection === 'club-members') {
    data.submittedBy = req.user.id
  }

  return data
}
