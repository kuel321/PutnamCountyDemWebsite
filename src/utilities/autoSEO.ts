import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import type { Media, Page } from '@/payload-types'
import { excerpt } from '@/utilities/textExcerpt'

type LayoutBlocks = NonNullable<Page['layout']>

// Used when a page has no meta image set and no usable image in its own
// blocks, so social shares always show something rather than a blank card.
export const SITE_FALLBACK_IMAGE = '/media/spruce_knob.jpg'

/**
 * Falls back to auto-generating SEO fields from a page's own content blocks
 * when the admin hasn't filled in the manual SEO tab — most won't. Scans
 * blocks in order and uses the first usable text/image found, so it stays
 * accurate as the page gets built out rather than needing a save-time hook.
 */
export function autoDescriptionFromBlocks(
  blocks: LayoutBlocks | null | undefined,
  maxLength = 155,
): string | null {
  for (const block of blocks ?? []) {
    const richText =
      block.blockType === 'content'
        ? block.richText
        : block.blockType === 'mediaContent'
          ? block.content
          : null

    if (!richText) continue

    // convertLexicalToPlaintext joins block-level nodes (paragraphs,
    // headings) with newlines — collapse to spaces since this is going into
    // a single-line meta description, not displayed body text.
    const text = convertLexicalToPlaintext({ data: richText }).replace(/\s+/g, ' ').trim()
    if (text) return excerpt(text, maxLength)
  }

  return null
}

export function autoImageFromBlocks(blocks: LayoutBlocks | null | undefined): Media | null {
  for (const block of blocks ?? []) {
    if (block.blockType === 'mediaContent' && block.media && typeof block.media === 'object') {
      return block.media
    }

    if (block.blockType === 'mediaGrid') {
      const first = block.items?.find((item) => item.media && typeof item.media === 'object')
      if (first?.media && typeof first.media === 'object') return first.media
    }
  }

  return null
}
