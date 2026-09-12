import { redirect } from 'next/navigation'

import { getClubMember } from '@/utilities/getClubMember'
import { LogoutButton } from '@/components/Members/LogoutButton'
import { PublishedMinutesAccordion } from '@/components/Members/PublishedMinutesAccordion'

export default async function MembersDashboardPage() {
  const member = await getClubMember()
  if (!member) redirect('/members/login')

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            Welcome, {member.name}
          </h1>
          <LogoutButton />
        </div>

        <h2 className="mt-12 text-lg font-semibold text-brand-navy">Approved Meeting Minutes</h2>
        <PublishedMinutesAccordion />
      </div>
    </section>
  )
}
