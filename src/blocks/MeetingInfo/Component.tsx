import config from '@payload-config'
import { getPayload } from 'payload'

import type { Meeting, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function MeetingListItem({ meeting }: { meeting: Meeting }) {
  const photos = (meeting.photos ?? []).filter(
    (photo): photo is { image: Media; id?: string | null } =>
      Boolean(photo.image) && typeof photo.image === 'object' && !photo.hideFromPublic,
  )

  return (
    <li className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
      {photos.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-2 sm:w-40">
          {photos.map((photo, index) => (
            <div key={photo.id ?? index} className="relative z-0 hover:z-20">
              <img
                src={getMediaUrl(photo.image.url)}
                alt={photo.image.alt || `${meeting.title} photo`}
                className="h-36 w-36 cursor-zoom-in object-cover transition-transform duration-200 ease-out hover:scale-[2.25] hover:shadow-2xl"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="font-semibold text-brand-navy">
          {formatDate(meeting.date)}
          {meeting.time ? ` · ${meeting.time}` : ''}
        </div>
        <p className="mt-1 font-medium text-gray-900">{meeting.title}</p>
        {meeting.location && <p className="text-sm text-gray-500">{meeting.location}</p>}
        {meeting.notes && <p className="mt-1 text-sm text-gray-500">{meeting.notes}</p>}
      </div>
    </li>
  )
}

export async function MeetingInfoBlock() {
  const payload = await getPayload({ config })
  const today = new Date(new Date().toDateString()).toISOString()

  const [upcomingResult, pastResult] = await Promise.all([
    payload.find({
      collection: 'meetings',
      sort: 'date',
      limit: 100,
      depth: 1,
      where: {
        date: { greater_than_equal: today },
      },
    }),
    payload.find({
      collection: 'meetings',
      sort: '-date',
      limit: 5,
      depth: 1,
      where: {
        date: { less_than: today },
      },
    }),
  ])

  const upcomingMeetings = upcomingResult.docs
  const pastMeetings = pastResult.docs

  return (
    <>
      <section className="bg-gray-50 px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-brand-navy">Upcoming Meetings & Events</h2>

          {upcomingMeetings.length === 0 ? (
            <p className="mt-4 text-gray-500">No upcoming meetings are scheduled right now.</p>
          ) : (
            <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              {upcomingMeetings.map((meeting) => (
                <MeetingListItem key={meeting.id} meeting={meeting} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-brand-navy">Past Meetings</h2>

          {pastMeetings.length === 0 ? (
            <p className="mt-4 text-gray-500">No past meetings to show yet.</p>
          ) : (
            <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              {pastMeetings.map((meeting) => (
                <MeetingListItem key={meeting.id} meeting={meeting} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
