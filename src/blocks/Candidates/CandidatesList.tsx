'use client'

import { useMemo, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Candidate } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const typeLabels: Record<Candidate['type'], string> = {
  'federal-state': 'Federal / State',
  'putnam-county': 'Putnam Co.',
}

type Filter = 'all' | Candidate['type']

function CandidateItem({ candidate }: { candidate: Candidate }) {
  const headshot =
    candidate.headshot && typeof candidate.headshot === 'object' ? candidate.headshot : null

  return (
    <details className="group p-5">
      <summary className="flex cursor-pointer list-none items-center gap-4">
        {headshot ? (
          <img
            src={getMediaUrl(headshot.url)}
            alt={headshot.alt || candidate.title}
            className="h-24 w-24 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="h-24 w-24 shrink-0 rounded-md bg-gray-100" />
        )}

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-brand-navy">{candidate.title}</p>
          {candidate.office && <p className="truncate text-sm text-gray-500">{candidate.office}</p>}
        </div>

        <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-180">
          &#9662;
        </span>
      </summary>

      <div className="mt-4 border-t border-gray-100 pt-4">
        {candidate.content ? (
          <RichText
            data={candidate.content}
            className="prose max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
          />
        ) : (
          <p className="text-sm text-gray-500">Full bio coming soon.</p>
        )}

        <a
          href={`/candidate/${candidate.slug}`}
          className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
        >
          View full profile &rarr;
        </a>
      </div>
    </details>
  )
}

function CandidateGroup({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
      {candidates.map((candidate) => (
        <CandidateItem key={candidate.id} candidate={candidate} />
      ))}
    </div>
  )
}

export function CandidatesList({ candidates }: { candidates: Candidate[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const federalCandidates = candidates.filter((c) => c.type === 'federal-state')
  const putnamCandidates = candidates.filter((c) => c.type === 'putnam-county')

  const putnamByDistrict = useMemo(() => {
    const groups = new Map<string, { label: string; order: number; candidates: Candidate[] }>()

    for (const candidate of putnamCandidates) {
      const district =
        candidate.district && typeof candidate.district === 'object' ? candidate.district : null
      const key = district ? String(district.id) : 'unassigned'
      const label = district?.title || 'District TBD'
      const order = district?.number ?? Number.MAX_SAFE_INTEGER

      if (!groups.has(key)) {
        groups.set(key, { label, order, candidates: [] })
      }
      groups.get(key)!.candidates.push(candidate)
    }

    return Array.from(groups.values()).sort((a, b) => a.order - b.order)
  }, [putnamCandidates])

  const showFederal = filter === 'all' || filter === 'federal-state'
  const showPutnam = filter === 'all' || filter === 'putnam-county'

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', 'All Candidates'],
            ['federal-state', typeLabels['federal-state']],
            ['putnam-county', typeLabels['putnam-county']],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === value
                ? 'bg-brand-navy text-white'
                : 'border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {showFederal && federalCandidates.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-brand-navy">
              {typeLabels['federal-state']}
            </h3>
            <div className="mt-4">
              <CandidateGroup candidates={federalCandidates} />
            </div>
          </div>
        )}

        {showPutnam && putnamByDistrict.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-brand-navy">{typeLabels['putnam-county']}</h3>
            <div className="mt-4 space-y-6">
              {putnamByDistrict.map((group) => (
                <div key={group.label}>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {group.label}
                  </h4>
                  <div className="mt-2">
                    <CandidateGroup candidates={group.candidates} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
