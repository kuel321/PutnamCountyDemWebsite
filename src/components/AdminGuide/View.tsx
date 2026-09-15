import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'

import { AdminGuideContent } from './Content'

export default function AdminGuideView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      req={initPageResult.req}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <AdminGuideContent />
    </DefaultTemplate>
  )
}
