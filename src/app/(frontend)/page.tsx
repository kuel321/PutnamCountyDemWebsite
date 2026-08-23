import { getGlobal } from '@/utilities/getGlobals'
import { resolveHref } from '@/components/Header/resolveHref'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export default async function HomePage() {
  const headerData = await getGlobal('header', 1)
  const quickLinks = (headerData.navItems ?? []).filter((item) => item.navItem.label !== 'Home')

  return (
    <>
      <section
        className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-brand-navy bg-cover bg-fixed px-6 text-center text-white"
        style={{
          backgroundImage:
            'url(/_next/image?url=%2Fmedia%2Fputnam-county-park.jpg&w=1920&q=100)',
          backgroundPosition: 'center 70%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/95 via-brand-navy/80 to-brand-red/50" />

        <div className="relative mx-auto max-w-5xl">
          {headerData.logo && typeof headerData.logo === 'object' && (
            <img
              src={getMediaUrl(headerData.logo.url)}
              alt={headerData.logo.alt || 'Putnam County Democratic Party'}
              className="mx-auto h-20 w-auto brightness-0 invert sm:h-28"
            />
          )}
          <h1 className="mt-2 whitespace-nowrap text-[clamp(1.375rem,4.2vw,3.75rem)] font-bold">
            Democrats Fighting for Working Families
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Organizing Democrats in Putnam County, West Virginia to elect leaders who fight for
            working families.
          </p>

          <div className="mt-8 inline-flex overflow-hidden rounded-lg shadow-xl">
            <a
              href="/meeting-dates-location"
              className="bg-white px-7 py-4 text-sm font-bold uppercase tracking-wide text-brand-navy transition-colors hover:bg-gray-100"
            >
              Get Involved
            </a>
            {headerData.donateButton?.url && (
              <a
                href={headerData.donateButton.url}
                className="border-l border-white/25 bg-brand-red px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-red-dark"
              >
                {headerData.donateButton.text || 'Contribute'}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-brand-navy sm:text-3xl">
            Get to Know Us
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((item) => {
              const href = resolveHref(item.navItem.link)
              return (
                <a
                  key={item.id}
                  href={href}
                  className="block rounded-lg border border-gray-200 p-6 shadow-sm transition hover:border-brand-navy hover:shadow-md"
                >
                  <h3 className="font-semibold text-brand-navy">{item.navItem.label}</h3>
                  <span className="mt-2 inline-block text-sm text-brand-red">Learn more &rarr;</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
