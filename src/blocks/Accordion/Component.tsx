'use client'

import { useEffect, useState } from 'react'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { RichText } from '@/components/RichText'
import { excerpt } from '@/utilities/textExcerpt'

import type { AccordionBlock as AccordionBlockProps } from '@/payload-types'

// Below this, an item's full content shows with no "Read more" at all.
const EXCERPT_LENGTH = 150

type Item = NonNullable<AccordionBlockProps['items']>[number]

function AccordionItem({ item, index }: { item: Item; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const plainText = item.content
    ? convertLexicalToPlaintext({ data: item.content }).replace(/\s+/g, ' ').trim()
    : ''
  const isLong = plainText.length > EXCERPT_LENGTH

  useEffect(() => {
    if (item.anchorId && window.location.hash === `#${item.anchorId}`) {
      setExpanded(true)
      document.getElementById(item.anchorId)?.scrollIntoView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id={item.anchorId || undefined} className="scroll-mt-24">
      <div className="text-3xl font-extrabold text-brand-red">{String(index + 1).padStart(2, '0')}</div>
      <h3 className="mt-2 text-xl font-bold text-brand-navy">{item.heading}</h3>

      {item.content &&
        (expanded || !isLong ? (
          <RichText
            data={item.content}
            className="prose mt-2 max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
          />
        ) : (
          <p className="mt-2 text-gray-600">{excerpt(plainText, EXCERPT_LENGTH)}</p>
        ))}

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 font-bold text-brand-red hover:underline"
        >
          {expanded ? 'Show less ←' : 'Read more →'}
        </button>
      )}
    </div>
  )
}

export function AccordionBlock({ items, anchorId }: AccordionBlockProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section id={anchorId || undefined} className="scroll-mt-24 px-6 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <AccordionItem key={item.id ?? index} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
