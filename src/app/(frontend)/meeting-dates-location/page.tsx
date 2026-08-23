import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default async function MeetingDatesLocationPage() {
  const payload = await getPayload({ config })

  const [pageResult, meetingsResult, minutesResult] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: 'meeting-dates-location' } },
    }),
    payload.find({
      collection: 'meetings',
      sort: 'date',
      limit: 100,
      where: {
        date: { greater_than_equal: new Date(new Date().toDateString()).toISOString() },
      },
    }),
    payload.find({
      collection: 'meeting-minutes',
      sort: '-date',
      limit: 100,
    }),
  ])

  const page = pageResult.docs[0]
  if (!page) {
    notFound()
  }

  const meetings = meetingsResult.docs
  const minutes = minutesResult.docs

  return (
    <>
      <section className="bg-brand-navy px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{page.title}</h1>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {page.content ? (
            <RichText
              data={page.content}
              className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
            />
          ) : (
            <p className="text-gray-500">Content coming soon.</p>
          )}
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-brand-navy">Upcoming Meetings & Events</h2>

          {meetings.length === 0 ? (
            <p className="mt-4 text-gray-500">No upcoming meetings are scheduled right now.</p>
          ) : (
            <ul className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
              {meetings.map((meeting) => (
                <li key={meeting.id} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:gap-6">
                  <div className="shrink-0 font-semibold text-brand-navy sm:w-56">
                    {formatDate(meeting.date)}
                    {meeting.time ? ` · ${meeting.time}` : ''}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    {meeting.location && <p className="text-sm text-gray-500">{meeting.location}</p>}
                    {meeting.notes && <p className="mt-1 text-sm text-gray-500">{meeting.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-brand-navy">Meeting Minutes</h2>

          {minutes.length === 0 ? (
            <p className="mt-4 text-gray-500">No meeting minutes have been posted yet.</p>
          ) : (
            <div className="mt-6 space-y-10">
              {minutes.map((entry) => (
                <article key={entry.id} className="border-b border-gray-200 pb-8 last:border-none">
                  <h3 className="text-lg font-semibold text-brand-navy">{entry.title}</h3>
                  <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                  {entry.content && (
                    <RichText
                      data={entry.content}
                      className="prose prose-sm mt-3 max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
                    />
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
