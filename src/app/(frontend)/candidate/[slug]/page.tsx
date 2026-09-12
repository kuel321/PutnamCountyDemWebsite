import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveHref } from '@/components/Header/resolveHref'

type CandidatePageProps = {
  params: Promise<{ slug: string }>
}

const typeLabels: Record<string, string> = {
  'federal-state': 'Federal / State',
  'putnam-county': 'Putnam County',
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'candidates',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const candidate = result.docs[0]
  if (!candidate) {
    notFound()
  }

  const district =
    candidate.district && typeof candidate.district === 'object' ? candidate.district : null
  const headshot =
    candidate.headshot && typeof candidate.headshot === 'object' ? candidate.headshot : null

  return (
    <>
      <section className="bg-brand-navy px-6 py-12 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          {headshot && (
            <img
              src={getMediaUrl(headshot.url)}
              alt={headshot.alt || candidate.title}
              className="h-32 w-32 shrink-0 rounded-full border-4 border-white/20 object-cover sm:h-40 sm:w-40"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{candidate.title}</h1>
            <p className="mt-2 text-white/70">
              {typeLabels[candidate.type] ?? candidate.type}
              {district && ` · ${district.title}`}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {candidate.content && (
            <RichText
              data={candidate.content}
              className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
            />
          )}

          {candidate.links && candidate.links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {candidate.links.map((item, index) => {
                const href = resolveHref(item.link)
                if (!href) return null

                return (
                  <a
                    key={item.id ?? index}
                    href={href}
                    target={item.link.newTab ? '_blank' : undefined}
                    rel={item.link.newTab ? 'noopener noreferrer' : undefined}
                    className={
                      item.link.appearance === 'outline'
                        ? 'rounded-md border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white'
                        : 'rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90'
                    }
                  >
                    {item.link.label}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
