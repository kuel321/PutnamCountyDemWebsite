import type { FindDistrictBlock as FindDistrictBlockProps } from '@/payload-types'
import { FindDistrictFinder } from './Finder'

export function FindDistrictBlock({ heading, intro }: FindDistrictBlockProps) {
  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {heading && (
          <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">{heading}</h2>
        )}
        {intro && <p className="mt-3 max-w-2xl text-gray-600">{intro}</p>}

        <div className="mt-8">
          <FindDistrictFinder />
        </div>
      </div>
    </section>
  )
}
