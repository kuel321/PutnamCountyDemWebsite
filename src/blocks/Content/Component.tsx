import { RichText } from '@payloadcms/richtext-lexical/react'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

export function ContentBlock({ richText }: ContentBlockProps) {
  if (!richText) {
    return null
  }

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <RichText
          data={richText}
          className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
        />
      </div>
    </section>
  )
}
