import config from '@payload-config'
import { getPayload } from 'payload'

import type { CandidatesBlock as CandidatesBlockProps } from '@/payload-types'

import { CandidatesList } from './CandidatesList'

export async function CandidatesBlock({ heading }: CandidatesBlockProps) {
  const payload = await getPayload({ config })

  const { docs: candidates } = await payload.find({
    collection: 'candidates',
    depth: 1,
    limit: 200,
    sort: 'title',
  })

  if (candidates.length === 0) return null

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {heading && <h2 className="text-2xl font-bold text-brand-navy">{heading}</h2>}
        <div className={heading ? 'mt-8' : ''}>
          <CandidatesList candidates={candidates} />
        </div>
      </div>
    </section>
  )
}
