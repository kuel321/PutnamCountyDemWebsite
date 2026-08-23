import type { Header as HeaderType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { HeaderNav } from './HeaderNav'

export function Header({ data }: { data: HeaderType }) {
  return (
    <header className="relative border-b-4 border-brand-navy bg-white">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-6 px-6 py-3">
        <a href="/" className="shrink-0">
          {data.logo && typeof data.logo === 'object' && (
            <img
              src={getMediaUrl(data.logo.url)}
              alt={data.logo.alt || 'Site logo'}
              className="h-14 w-auto"
            />
          )}
        </a>

        <HeaderNav navItems={data.navItems} donateButton={data.donateButton} />
      </div>
    </header>
  )
}
