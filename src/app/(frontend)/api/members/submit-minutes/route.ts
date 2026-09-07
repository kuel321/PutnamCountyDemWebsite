import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { getClubMember } from '@/utilities/getClubMember'

export async function POST(request: Request) {
  const member = await getClubMember()

  if (!member) {
    return NextResponse.json({ error: 'You must be logged in to submit minutes.' }, { status: 401 })
  }

  const formData = await request.formData()
  const title = formData.get('title')
  const date = formData.get('date')
  const file = formData.get('file')

  if (typeof title !== 'string' || !title || typeof date !== 'string' || !date) {
    return NextResponse.json({ error: 'Title and date are required.' }, { status: 400 })
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'A PDF or Word document is required.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const media = await payload.create({
      collection: 'media',
      data: {},
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      user: member,
      overrideAccess: false,
    })

    const submission = await payload.create({
      collection: 'minutes-submissions',
      data: {
        title,
        date,
        file: media.id,
      },
      user: member,
      overrideAccess: false,
    })

    return NextResponse.json({ id: submission.id })
  } catch {
    return NextResponse.json({ error: 'Could not submit minutes.' }, { status: 400 })
  }
}
