import config from '@payload-config'
import { getPayload } from 'payload'

import type { SampleBallotBlock as SampleBallotBlockProps } from '@/payload-types'

import { SampleBallotView, type BallotRaceData, type BallotStyleData } from './SampleBallotView'

export async function SampleBallotBlock({
  heading,
  intro,
  precinctLookupUrl,
  anchorId,
}: SampleBallotBlockProps) {
  const payload = await getPayload({ config })

  const [{ docs: styleDocs }, { docs: raceDocs }] = await Promise.all([
    payload.find({ collection: 'ballot-styles', sort: 'order', limit: 100, depth: 0 }),
    payload.find({ collection: 'ballot-races', sort: 'order', limit: 500, depth: 1 }),
  ])

  if (raceDocs.length === 0) return null

  // Only send the client what it renders — not whole populated docs.
  const styles: BallotStyleData[] = styleDocs.map((s) => ({
    id: s.id,
    name: s.name,
    precincts: s.precincts
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean),
    officialBallotUrl: s.officialBallotUrl ?? null,
  }))

  const races: BallotRaceData[] = raceDocs.map((r) => ({
    id: r.id,
    office: r.office,
    subtitle: r.subtitle ?? null,
    ticket: r.ticket,
    voteFor: r.voteFor ?? 1,
    note: r.note ?? null,
    styleIds: (r.ballotStyles ?? []).map((s) => (typeof s === 'object' ? s.id : s)),
    choices: (r.choices ?? []).map((c) => ({
      id: c.id ?? c.name,
      name: c.name,
      party: c.party ?? null,
      hometown: c.hometown ?? null,
      profileSlug: c.candidate && typeof c.candidate === 'object' ? c.candidate.slug ?? null : null,
    })),
  }))

  return (
    <section id={anchorId || undefined} className="scroll-mt-24 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <SampleBallotView
          heading={heading ?? null}
          intro={intro ?? null}
          precinctLookupUrl={precinctLookupUrl ?? null}
          styles={styles}
          races={races}
        />
      </div>
    </section>
  )
}
