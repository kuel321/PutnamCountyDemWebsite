import config from '@payload-config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { CLUB_MEMBER_COOKIE } from '@/utilities/getClubMember'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    const { token, user } = await payload.login({
      collection: 'club-members',
      data: { email, password },
    })

    if (!token) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(CLUB_MEMBER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2,
    })

    return NextResponse.json({ name: user?.name })
  } catch {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }
}
