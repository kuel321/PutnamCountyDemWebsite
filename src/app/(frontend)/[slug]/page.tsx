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
      <h1 className="pageTitle">{page.title}</h1>
      {page.content && <RichText data={page.content} />}
    </>
  )
}
