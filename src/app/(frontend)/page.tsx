import { getGlobal } from '@/utilities/getGlobals'
import { resolveHref } from '@/components/Header/resolveHref'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { HomeSidebar } from '@/components/HomeSidebar'
import { RotatingWord } from '@/components/Hero/RotatingWord'

// Home page content (Highlights, Candidate ads, Meetings) is edited in the
// admin panel, not through a code deploy — revalidate periodically so those
// changes actually show up without a full rebuild.
export const revalidate = 60

export default async function HomePage() {
  const headerData = await getGlobal('header', 1)
  const quickLinks = (headerData.navItems ?? []).filter((item) => item.navItem.label !== 'Home')

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-brand-navy-dark px-6 pb-14 pt-40 text-white sm:min-h-[85vh] sm:px-10 sm:pb-20 lg:px-16">
        <div
          className="absolute inset-0 bg-cover bg-scroll lg:bg-fixed"
          style={{
            backgroundImage: 'url(/_next/image?url=%2Fmedia%2Fspruce_knob.jpg&w=1920&q=100)',
            backgroundPosition: 'center 70%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-brand-navy-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-dark/95 via-brand-navy-dark/30 to-transparent sm:via-brand-navy-dark/20" />

        <div className="relative max-w-2xl">
          {headerData.logo && typeof headerData.logo === 'object' && (
            <img
              src={getMediaUrl(headerData.logo.url)}
              alt={headerData.logo.alt || 'Putnam County Democratic Party'}
              className="h-14 w-auto brightness-0 invert sm:h-16"
            />
          )}

          <h1 className="mt-5 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Fighting for
            <br />
            <RotatingWord />
          </h1>

          <p className="mt-6 max-w-lg text-lg text-white/80">
            Organizing Democrats in Putnam County, West Virginia to elect leaders who put working
            families first.
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
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">Get to Know Us</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {quickLinks.map((item) => {
                const href = resolveHref(item.navItem.link)
                return (
                  <a
                    key={item.id}
                    href={href}
                    className="block rounded-lg border border-gray-200 p-6 shadow-sm transition hover:border-brand-navy hover:shadow-md"
                  >
                    <h3 className="font-semibold text-brand-navy">{item.navItem.label}</h3>
                    <span className="mt-2 inline-block text-sm text-brand-red">
                      Learn more &rarr;
                    </span>
                  </a>
                )
              })}
            </div>
          </div>

          <HomeSidebar />
        </div>
      </section>
    </>
  )
}
