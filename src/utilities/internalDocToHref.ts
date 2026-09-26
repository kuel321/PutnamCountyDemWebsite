import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'

/**
 * Resolves a rich-text "Internal Link" (a link picked from Pages/Posts via
 * the link tool's relationship picker, as opposed to a typed Custom URL)
 * to an actual href.
 *
 * Without this, @payloadcms/richtext-lexical's default JSX converter has no
 * way to know how this site's URLs are structured, so it silently falls
 * back to `href="#"` for every internal link — which just re-links the
 * current page to itself.
 */
export function internalDocToHref({ linkNode }: { linkNode: SerializedLinkNode }): string {
  const value = linkNode.fields.doc?.value

  if (typeof value !== 'object' || !value.slug) {
    console.error(
      'internalDocToHref: could not resolve a slug for this internal link — the document may need to be fetched with `depth` >= 1 wherever this rich text is rendered.',
      linkNode.fields.doc,
    )
    return '#'
  }

  // Posts don't currently have their own route in this app — like the
  // header's nav link resolver, every reference just resolves to /slug.
  return `/${value.slug}`
}
