import { RichText as RichTextWithoutConverters, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { internalDocToHref } from '@/utilities/internalDocToHref'

// Flattens a heading node's children down to plain text, for slugifying.
function headingText(node: { children?: unknown[] }): string {
  return (node.children ?? [])
    .map((child) => {
      const c = child as { text?: string; children?: unknown[] }
      if (typeof c.text === 'string') return c.text
      if (c.children) return headingText(c)
      return ''
    })
    .join('')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Every heading in rich text gets an auto-generated anchor id from its
  // own text (e.g. "Our History" -> #our-history), so any heading anywhere
  // rich text is used can be deep-linked to with no extra editor step.
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag
    const id = slugify(headingText(node)) || undefined
    return (
      <Tag id={id} className="scroll-mt-24">
        {children}
      </Tag>
    )
  },
})

/**
 * Drop-in replacement for @payloadcms/richtext-lexical/react's RichText,
 * with internal links (Pages/Posts picked via the link tool) resolving to
 * real URLs instead of the library's bare "#" fallback.
 */
export function RichText(props: Omit<React.ComponentProps<typeof RichTextWithoutConverters>, 'converters'>) {
  return <RichTextWithoutConverters converters={jsxConverters} {...props} />
}
