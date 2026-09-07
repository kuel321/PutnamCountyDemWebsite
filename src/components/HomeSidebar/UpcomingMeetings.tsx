import config from '@payload-config'
import { getPayload } from 'payload'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export async function UpcomingMeetings() {
  const payload = await getPayload({ config })

  const { docs: meetings } = await payload.find({
    collection: 'meetings',
    sort: 'date',
    limit: 5,
    where: {
      date: { greater_than_equal: new Date(new Date().toDateString()).toISOString() },
    },
  })

  if (meetings.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-brand-navy">Upcoming Meetings</h3>
      <ul className="mt-4 divide-y divide-gray-100">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="w-14 shrink-0 text-sm font-semibold text-brand-red">
              {formatDate(meeting.date)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
              {meeting.location && <p className="text-xs text-gray-500">{meeting.location}</p>}
            </div>
          </li>
        ))}
      </ul>
      <a
        href="/meeting-dates-location"
        className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
      >
        View all meetings &rarr;
      </a>
    </div>
  )
}
