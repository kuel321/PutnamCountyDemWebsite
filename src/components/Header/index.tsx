import type { Header as HeaderType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export function Header({ data }: { data: HeaderType }) {
  return (
    <header className="pcd-header">
      <div className="logo-container">
        {data.logo && typeof data.logo == 'object' && (
          <img src={getMediaUrl(data.logo.url)} alt="Company logo" className="pcd-logo" />
        )}
      </div>
      <nav className="link-group-container">
        {data.links?.map((item) => {
          const link = item.link
          let href = ''
          if (link.type == 'custom') {
            href = link.url ?? ''
          } else if (link.type == 'reference' && link.reference) {
            const target = link.reference.value
            if (typeof target === 'object') {
              href = `/${target.slug}`
            }
          }
          return (
            <a
              key={item.id}
              href={href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopenor noreferrer' : undefined}
            >
              {link.label}
            </a>
          )
        })}
      </nav>
      <div className="donate-button-container">
        {data.donateButton?.url && (
          <a href={data.donateButton.url} className="pcd-donate-button">
            {data.donateButton.text}
          </a>
        )}
      </div>
    </header>
  )
}
