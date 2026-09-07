import { redirect } from 'next/navigation'

import { getClubMember } from '@/utilities/getClubMember'
import { SubmitMinutesForm } from '@/components/Members/SubmitMinutesForm'

export default async function SubmitMinutesPage() {
  const member = await getClubMember()
  if (!member) redirect('/members/login')

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">Submit Meeting Minutes</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your submission will be reviewed by club staff before it&apos;s posted publicly.
        </p>
        <SubmitMinutesForm />
      </div>
    </section>
  )
}
