'use client'

import { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { resolveHref } from './resolveHref'

type NavItems = HeaderType['navItems']
type DonateButton = HeaderType['donateButton']

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DonateLink({ donateButton, className }: { donateButton?: DonateButton; className: string }) {
  if (!donateButton?.url) return null
  return (
    <a href={donateButton.url} className={className}>
      {donateButton.text || 'Contribute'}
    </a>
  )
}

export function HeaderNav({
  navItems,
  donateButton,
}: {
  navItems: NavItems
  donateButton: DonateButton
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  return (
    <div className="flex flex-1 items-center justify-end">
      {/* Desktop nav */}
      <nav className="hidden items-center gap-0.5 2xl:flex">
        {navItems?.map((item) => {
          const { navItem, id } = item
          const hasDropdown = navItem.type === 'dropdown' && (navItem.subLinks?.length ?? 0) > 0

          if (hasDropdown) {
            return (
              <div key={id} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 whitespace-nowrap px-2.5 py-2 text-sm font-semibold text-brand-navy hover:text-brand-red"
                >
                  {navItem.label}
                  <ChevronIcon className="h-3 w-3 shrink-0 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-0 top-full z-10 min-w-[12rem] rounded-b-md border border-t-0 border-gray-200 bg-white py-2 opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {navItem.subLinks?.map((subLink) => (
                    <a
                      key={subLink.id}
                      href={resolveHref(subLink.link)}
                      target={subLink.link.newTab ? '_blank' : undefined}
                      rel={subLink.link.newTab ? 'noopener noreferrer' : undefined}
                      className="block px-4 py-2 text-sm font-medium text-brand-navy hover:bg-gray-50 hover:text-brand-red"
                    >
                      {subLink.link.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          }

          return (
            <a
              key={id}
              href={resolveHref(navItem.link)}
              target={navItem.link?.newTab ? '_blank' : undefined}
              rel={navItem.link?.newTab ? 'noopener noreferrer' : undefined}
              className="whitespace-nowrap px-2.5 py-2 text-sm font-semibold text-brand-navy hover:text-brand-red"
            >
              {navItem.label}
            </a>
          )
        })}

        <DonateLink
          donateButton={donateButton}
          className="ml-2 whitespace-nowrap rounded bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark"
        />
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="flex items-center justify-center p-2 text-brand-navy 2xl:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {mobileOpen ? (
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav className="absolute left-0 right-0 top-full z-20 flex flex-col border-t border-gray-200 bg-white shadow-lg 2xl:hidden">
          {navItems?.map((item) => {
            const { navItem, id } = item
            const hasDropdown = navItem.type === 'dropdown' && (navItem.subLinks?.length ?? 0) > 0
            const isOpen = openDropdownId === id

            if (hasDropdown) {
              return (
                <div key={id} className="border-b border-gray-100">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-3 text-left font-semibold text-brand-navy"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDropdownId(isOpen ? null : (id ?? null))}
                  >
                    {navItem.label}
                    <ChevronIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="flex flex-col bg-gray-50 pb-2">
                      {navItem.subLinks?.map((subLink) => (
                        <a
                          key={subLink.id}
                          href={resolveHref(subLink.link)}
                          target={subLink.link.newTab ? '_blank' : undefined}
                          rel={subLink.link.newTab ? 'noopener noreferrer' : undefined}
                          className="px-8 py-2 text-sm font-medium text-brand-navy"
                          onClick={() => setMobileOpen(false)}
                        >
                          {subLink.link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <a
                key={id}
                href={resolveHref(navItem.link)}
                target={navItem.link?.newTab ? '_blank' : undefined}
                rel={navItem.link?.newTab ? 'noopener noreferrer' : undefined}
                className="border-b border-gray-100 px-6 py-3 font-semibold text-brand-navy"
                onClick={() => setMobileOpen(false)}
              >
                {navItem.label}
              </a>
            )
          })}

          <DonateLink
            donateButton={donateButton}
            className="m-4 rounded bg-brand-red px-5 py-3 text-center font-semibold text-white"
          />
        </nav>
      )}
    </div>
  )
}
