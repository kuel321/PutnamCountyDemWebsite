import { RichText as RichTextWithoutConverters, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { internalDocToHref } from '@/utilities/internalDocToHref'

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

/**
 * Drop-in replacement for @payloadcms/richtext-lexical/react's RichText,
 * with internal links (Pages/Posts picked via the link tool) resolving to
 * real URLs instead of the library's bare "#" fallback.
 */
export function RichText(props: Omit<React.ComponentProps<typeof RichTextWithoutConverters>, 'converters'>) {
  return <RichTextWithoutConverters converters={jsxConverters} {...props} />
}
