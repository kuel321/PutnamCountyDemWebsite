import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { CLUB_MEMBER_COOKIE } from '@/utilities/getClubMember'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(CLUB_MEMBER_COOKIE)
  return NextResponse.json({ success: true })
}
