import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getClubMember } from '@/utilities/getClubMember'
import { LogoutButton } from '@/components/Members/LogoutButton'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default async function MembersDashboardPage() {
  const member = await getClubMember()
  if (!member) redirect('/members/login')

  const payload = await getPayload({ config })

  const { docs: submissions } = await payload.find({
    collection: 'minutes-submissions',
    sort: '-createdAt',
    limit: 50,
    depth: 1,
    user: member,
    overrideAccess: false,
  })

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            Welcome, {member.name}
          </h1>
          <LogoutButton />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Your Meeting Minutes Submissions</h2>
          <a
            href="/members/submit-minutes"
            className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            Submit Minutes
          </a>
        </div>

        {submissions.length === 0 ? (
          <p className="mt-4 text-gray-500">You haven&apos;t submitted any minutes yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {submissions.map((submission) => (
              <li key={submission.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-gray-900">{submission.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  {submission.reviewNotes && (
                    <p className="mt-1 text-sm text-gray-500">Note: {submission.reviewNotes}</p>
                  )}
                  {submission.file && typeof submission.file === 'object' && (
                    <a
                      href={getMediaUrl(submission.file.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-brand-red hover:underline"
                    >
                      View uploaded file
                    </a>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[submission.status ?? 'pending']}`}
                >
                  {submission.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
