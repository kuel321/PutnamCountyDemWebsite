import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'

export const CLUB_MEMBER_COOKIE = 'club-member-token'

export async function getClubMember() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CLUB_MEMBER_COOKIE)?.value

  if (!token) return null

  const payload = await getPayload({ config })
  const { user } = await payload.auth({
    headers: new Headers({ Authorization: `JWT ${token}` }),
  })

  if (!user || user.collection !== 'club-members') return null

  return user
}
