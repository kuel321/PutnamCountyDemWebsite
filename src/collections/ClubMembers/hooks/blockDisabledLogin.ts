import type { CollectionBeforeLoginHook } from 'payload'

export const blockDisabledLogin: CollectionBeforeLoginHook = async ({ user }) => {
  if (user?.enabled === false) {
    throw new Error('This account has been disabled. Contact the club administrator for access.')
  }

  return user
}
