import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result.docs[0]
  if (!page) {
    notFound()
  }

  return (
    <>
      <section className="bg-brand-navy px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{page.title}</h1>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {page.content ? (
            <RichText
              data={page.content}
              className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
            />
          ) : (
            <p className="text-gray-500">Content coming soon.</p>
          )}
        </div>
      </section>
    </>
  )
}
