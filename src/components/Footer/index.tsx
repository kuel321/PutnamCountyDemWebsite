import type { Footer as FooterType, Header as HeaderType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
}

export function Footer({ data, logo }: { data: FooterType; logo: HeaderType['logo'] }) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
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
        </div>

        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="flex gap-4 text-sm">
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
            className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <img
              src="/media/chasingachancenolettersnokeyhole.png"
              alt="Chasing a Chance"
              className="h-5 w-auto"
            />
            Site by Chasing a Chance
          </a>
        </div>
      </div>
    </footer>
  )
}
