import { redirect } from 'next/navigation'

import { getClubMember } from '@/utilities/getClubMember'
import { LoginForm } from '@/components/Members/LoginForm'

export default async function MembersLoginPage() {
  const member = await getClubMember()
  if (member) redirect('/members')

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">Club Members Login</h1>
        <p className="mt-2 text-sm text-gray-500">
          This area is for Putnam County Democratic Club members only.
        </p>
      </div>
      <LoginForm />
    </section>
  )
}
