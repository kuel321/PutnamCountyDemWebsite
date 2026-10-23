'use client'

import { useEffect, useMemo, useState } from 'react'

export type BallotStyleData = {
  id: number
  name: string
  precincts: string[]
  officialBallotUrl: string | null
}

export type BallotRaceData = {
  id: number
  office: string
  subtitle: string | null
  ticket: string
  voteFor: number
  note: string | null
  styleIds: number[]
  choices: {
    id: string
    name: string
    party: string | null
    hometown: string | null
    profileSlug: string | null
  }[]
}

const TICKET_LABELS: Record<string, string> = {
  national: 'National Ticket',
  state: 'State Ticket',
  judicial: 'Nonpartisan Judicial Ballot',
  county: 'County Ticket',
  amendment: 'Constitutional Amendments',
  municipal: 'Town / City Ballot',
}

const VOTE_FOR_WORDS = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN']

function voteForLabel(n: number) {
  const word = VOTE_FOR_WORDS[n] ?? String(n)
  return n > 1 ? `Vote for not more than ${word}` : `Vote for ${word}`
}

function normalizePrecinct(value: string) {
  return value.trim().replace(/^0+/, '')
}

export function SampleBallotView({
  heading,
  intro,
  precinctLookupUrl,
  styles,
  races,
}: {
  heading: string | null
  intro: string | null
  precinctLookupUrl: string | null
  styles: BallotStyleData[]
  races: BallotRaceData[]
}) {
  const [styleId, setStyleId] = useState<number | null>(null)
  const [precinctInput, setPrecinctInput] = useState('')
  const [notFound, setNotFound] = useState(false)

  const findStyleForPrecinct = (precinct: string) =>
    styles.find((s) => s.precincts.some((p) => normalizePrecinct(p) === normalizePrecinct(precinct)))

  // ?precinct=23 in the URL preselects that ballot, so a link can be shared.
  useEffect(() => {
    const precinct = new URLSearchParams(window.location.search).get('precinct')
    if (!precinct) return
    const match = findStyleForPrecinct(precinct)
    if (match) {
      setStyleId(match.id)
      setPrecinctInput(precinct)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectStyle(id: number | null, precinct?: string) {
    setStyleId(id)
    setNotFound(false)
    const url = new URL(window.location.href)
    if (precinct) url.searchParams.set('precinct', precinct)
    else url.searchParams.delete('precinct')
    window.history.replaceState(null, '', url)
  }

  function handlePrecinctSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!precinctInput.trim()) return
    const match = findStyleForPrecinct(precinctInput)
    if (match) selectStyle(match.id, normalizePrecinct(precinctInput))
    else setNotFound(true)
  }

  const selectedStyle = styles.find((s) => s.id === styleId) ?? null

  const visibleRaces = useMemo(
    () =>
      races.filter((race) =>
        race.styleIds.length === 0 ? true : styleId !== null && race.styleIds.includes(styleId),
      ),
    [races, styleId],
  )

  const hiddenRaceCount = races.length - visibleRaces.length

  return (
    <div>
      {heading && <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">{heading}</h2>}
      {intro && <p className="mt-3 max-w-2xl text-gray-600">{intro}</p>}

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5 print:hidden">
        <form onSubmit={handlePrecinctSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="ballot-precinct" className="block text-sm font-medium text-gray-700">
              Your precinct number
            </label>
            <input
              id="ballot-precinct"
              inputMode="numeric"
              value={precinctInput}
              onChange={(e) => {
                setPrecinctInput(e.target.value)
                setNotFound(false)
              }}
              placeholder="e.g. 23"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-brand-navy px-5 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            Show my ballot
          </button>
        </form>

        <div className="mt-4">
          <label htmlFor="ballot-style" className="block text-sm font-medium text-gray-700">
            …or choose your ballot from the list
          </label>
          <select
            id="ballot-style"
            value={styleId ?? ''}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null
              setPrecinctInput('')
              selectStyle(id)
            }}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          >
            <option value="">Select precincts…</option>
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {notFound && (
          <p className="mt-3 text-sm text-brand-red">
            We couldn&apos;t find precinct &ldquo;{precinctInput}&rdquo; in Putnam County. Double-check
            the number on your voter registration card, or pick from the list above.
          </p>
        )}

        {precinctLookupUrl && (
          <p className="mt-3 text-sm text-gray-600">
            Don&apos;t know your precinct?{' '}
            <a
              href={precinctLookupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-red hover:underline"
            >
              Look it up here
            </a>
            .
          </p>
        )}
      </div>

      {selectedStyle ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Showing the ballot for <strong className="text-brand-navy">{selectedStyle.name}</strong>
          </p>
          <div className="flex gap-4 text-sm font-semibold print:hidden">
            {selectedStyle.officialBallotUrl && (
              <a
                href={selectedStyle.officialBallotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:underline"
              >
                Official county PDF
              </a>
            )}
            <button type="button" onClick={() => window.print()} className="text-brand-red hover:underline">
              Print my ballot
            </button>
          </div>
        </div>
      ) : (
        hiddenRaceCount > 0 && (
          <p className="mt-6 rounded-md bg-brand-navy/5 px-4 py-3 text-sm text-brand-navy print:hidden">
            Showing races that appear on <strong>every</strong> Putnam County ballot. Enter your
            precinct above to also see your State Senate, House of Delegates, and town races.
          </p>
        )
      )}

      <div className="mt-6 space-y-4">
        {visibleRaces.map((race, index) => {
          const showTicketHeader = index === 0 || visibleRaces[index - 1].ticket !== race.ticket
          return (
            <div key={race.id}>
              {showTicketHeader && (
                <h3 className="mb-3 mt-8 bg-brand-navy px-4 py-2 text-sm font-bold uppercase tracking-wide text-white first:mt-0">
                  {TICKET_LABELS[race.ticket] ?? race.ticket}
                </h3>
              )}
              <div className="break-inside-avoid rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-3">
                  <p className="font-bold text-brand-navy">{race.office}</p>
                  {race.subtitle && <p className="text-sm text-gray-600">{race.subtitle}</p>}
                  <p className="text-xs uppercase tracking-wide text-gray-400">{voteForLabel(race.voteFor)}</p>
                  {race.note && <p className="mt-2 text-sm text-gray-600">{race.note}</p>}
                </div>
                <ul className="divide-y divide-gray-100">
                  {race.choices.map((choice) => {
                    const isDem = choice.party === 'DEM'
                    return (
                      <li
                        key={choice.id}
                        className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 ${
                          isDem ? 'border-l-4 border-brand-navy bg-brand-navy/5' : ''
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-4 w-6 shrink-0 rounded-full border-2 border-gray-400"
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`font-semibold ${isDem ? 'text-brand-navy' : 'text-gray-900'}`}>
                            {choice.name}
                          </p>
                          {choice.hometown && <p className="text-xs text-gray-500">{choice.hometown}</p>}
                        </div>
                        {choice.profileSlug && (
                          <a
                            href={`/candidate/${choice.profileSlug}`}
                            className="text-sm font-semibold text-brand-red hover:underline print:hidden"
                          >
                            View profile →
                          </a>
                        )}
                        {choice.party && (
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              isDem ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {choice.party}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-gray-500">
        This is an unofficial guide prepared by the Putnam County Democratic Party. Always confirm
        with the official sample ballot from the Putnam County Clerk.
      </p>
    </div>
  )
}
