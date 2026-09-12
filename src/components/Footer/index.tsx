import type { Footer as FooterType, Header as HeaderType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveHref } from '@/components/Header/resolveHref'

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
}

function getFooterLinks(navItems: HeaderType['navItems']) {
  const links: { id: string; label: string; href: string }[] = []

  for (const item of navItems ?? []) {
    const { navItem } = item

    if (navItem.type === 'dropdown') {
      for (const subLink of navItem.subLinks ?? []) {
        const href = resolveHref(subLink.link)
        if (href) links.push({ id: subLink.id ?? subLink.link.label, label: subLink.link.label, href })
      }
    } else {
      const href = resolveHref(navItem.link)
      if (href) links.push({ id: item.id ?? navItem.label, label: navItem.label, href })
    }
  }

  return links
}

export function Footer({
  data,
  logo,
  navItems,
}: {
  data: FooterType
  logo: HeaderType['logo']
  navItems: HeaderType['navItems']
}) {
  const year = new Date().getFullYear()
  const footerLinks = getFooterLinks(navItems)

  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-8 px-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {logo && typeof logo === 'object' && (
            <img
              src={getMediaUrl(logo.url)}
              alt={logo.alt || 'Putnam County Democratic Party'}
              className="h-12 w-auto brightness-0 invert"
            />
          )}
          {data.contactEmail && (
            <a
              href={`mailto:${data.contactEmail}`}
              className="mt-2 block text-sm text-white/70 hover:text-white"
            >
              {data.contactEmail}
            </a>
          )}

          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="mt-4 flex gap-4 text-sm">
              {data.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white"
                >
                  {platformLabels[link.platform] || link.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {footerLinks.length > 0 && (
          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            {footerLinks.map((link) => (
              <a key={link.id} href={link.href} className="text-white/70 hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-[1800px] flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-white/50 sm:text-left">
            &copy; {year} Putnam County Democratic Party. Paid for by the Putnam County Democratic
            Party.
          </p>
          <a
            href={data.chasingAChanceUrl || 'https://chasingachance.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-[#f15a24] underline underline-offset-2 transition-colors hover:text-[#f15a24]/80"
          >
            <img
              src="/media/chasingachancenolettersnokeyhole.png"
              alt="Chasing a Chance"
              className="h-16 w-auto"
            />
            Site by Chasing a Chance
          </a>
        </div>
      </div>
    </footer>
  )
}
