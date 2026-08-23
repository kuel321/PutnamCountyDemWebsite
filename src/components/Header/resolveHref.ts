export type LinkField = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?:
    | {
        relationTo: 'pages' | 'posts'
        value:
          | number
          | {
              slug?: string | null
            }
      }
    | null
  url?: string | null
  label?: string
}

export function resolveHref(link?: LinkField | null): string {
  if (!link) return ''
  if (link.type === 'custom') {
    return link.url ?? ''
  }
  if (link.type === 'reference' && link.reference) {
    const target = link.reference.value
    if (typeof target === 'object' && target?.slug) {
      return `/${target.slug}`
    }
  }
  return ''
}
