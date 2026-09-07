'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/members/logout', { method: 'POST' })
    router.push('/members/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm font-semibold text-brand-red hover:underline"
    >
      Log out
    </button>
  )
}
