import type { StaticImageData } from 'next/image'
import { AnimateIn } from '@/components/AnimateIn'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    maxWidth,
  } = props

  const maxWidthStyle: React.CSSProperties =
    maxWidth && maxWidth !== 'full'
      ? {
          maxWidth: { xl: '1200px', lg: '900px', md: '600px', sm: '400px' }[maxWidth],
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }
      : {}

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <AnimateIn>
        <div style={maxWidthStyle}>
          <Media
            imgClassName={cn('', imgClassName)}
            resource={media}
            src={staticImage}
          />
        </div>
        </AnimateIn>
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
