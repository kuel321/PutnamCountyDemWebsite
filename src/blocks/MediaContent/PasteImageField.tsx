'use client'

import { useCallback, useState } from 'react'
import { UploadField, useField } from '@payloadcms/ui'
import type { UploadFieldClientProps } from 'payload'

export default function PasteImageField(props: UploadFieldClientProps) {
  const path = props.path ?? props.field.name
  const { setValue } = useField<number | string>({ path })
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')

  const handlePaste = useCallback(
    async (event: React.ClipboardEvent<HTMLDivElement>) => {
      const item = Array.from(event.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/'),
      )
      if (!item) return

      const file = item.getAsFile()
      if (!file) return

      event.preventDefault()
      setStatus('uploading')

      try {
        const extension = file.type.split('/')[1] || 'png'
        const filename =
          file.name && file.name !== 'image.png' ? file.name : `pasted-image-${Date.now()}.${extension}`

        const formData = new FormData()
        formData.append('file', file, filename)
        formData.append('_payload', JSON.stringify({ alt: 'Pasted image' }))

        const res = await fetch('/api/media', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (!res.ok) {
          throw new Error(`Upload failed with status ${res.status}`)
        }

        const { doc } = await res.json()
        setValue(doc.id)
        setStatus('idle')
      } catch (err) {
        console.error('Paste image upload failed:', err)
        setStatus('error')
      }
    },
    [setValue],
  )

  return (
    <div onPaste={handlePaste}>
      <UploadField {...props} />
      {status === 'uploading' && (
        <p style={{ color: 'var(--theme-text)', fontSize: '13px', marginTop: '4px' }}>
          Uploading pasted image…
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: 'var(--theme-error-500)', fontSize: '13px', marginTop: '4px' }}>
          Could not upload the pasted image. Try dragging the file in instead.
        </p>
      )}
    </div>
  )
}
