import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'

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

      <RenderBlocks blocks={page.layout} />
    </>
  )
}
