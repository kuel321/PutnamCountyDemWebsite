import type { Page } from '@/payload-types'

import { ContentBlock } from '@/blocks/Content/Component'
import { MeetingInfoBlock } from '@/blocks/MeetingInfo/Component'

type LayoutBlocks = NonNullable<Page['layout']>

export function RenderBlocks({ blocks }: { blocks?: LayoutBlocks | null }) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'content':
            return <ContentBlock key={block.id ?? index} {...block} />
          case 'meetingInfo':
            return <MeetingInfoBlock key={block.id ?? index} />
          default:
            return null
        }
      })}
    </>
  )
}
