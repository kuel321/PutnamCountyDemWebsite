import { RichText } from '@/components/RichText'

import type { NumberedListBlock as NumberedListBlockProps } from '@/payload-types'

export function NumberedListBlock({ items, anchorId }: NumberedListBlockProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section id={anchorId || undefined} className="scroll-mt-24 px-6 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.id ?? index}>
            <div className="text-3xl font-extrabold text-brand-red">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="mt-2 text-xl font-bold text-brand-navy">{item.heading}</h3>

            {item.content && (
              <RichText
                data={item.content}
                className="prose mt-2 max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
              />
            )}

            {item.anchorId && (
              <a href={`#${item.anchorId}`} className="mt-2 inline-block font-bold text-brand-red hover:underline">
                Read more →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
