import type { FormBlock as FormBlockProps } from '@/payload-types'
import { FormRenderer } from './FormRenderer'

export function FormBlock({ form }: FormBlockProps) {
  const formDoc = form && typeof form === 'object' ? form : null
  if (!formDoc) return null

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">{formDoc.title}</h2>
        <div className="mt-6">
          <FormRenderer form={formDoc} />
        </div>
      </div>
    </section>
  )
}
