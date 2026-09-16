'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AddressAutocomplete, type AddressSuggestion } from './AddressAutocomplete'
import { geoJsonToLeafletRings } from '@/utilities/geoJsonToLeafletRings'

const DistrictMap = dynamic(() => import('./DistrictMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      Loading map…
    </div>
  ),
})

type Result = {
  matchedAddress: string
  position: [number, number]
  rings: [number, number][][]
  magisterial: string
  house: string
  senate: string
  congressional: string
}

export function FindDistrictFinder() {
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  async function lookupDistrict(lat: number, lon: number, matchedAddress: string) {
    try {
      const res = await fetch(`/api/find-district/lookup?lat=${lat}&lon=${lon}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not determine districts for that location.')
        setStatus('error')
        return
      }

      setResult({
        matchedAddress,
        position: [lat, lon],
        rings: geoJsonToLeafletRings(data.magisterialGeometry),
        magisterial: data.magisterial,
        house: data.house,
        senate: data.senate,
        congressional: data.congressional,
      })
      setStatus('success')
    } catch {
      setError('Something went wrong looking that up. Please try again.')
      setStatus('error')
    }
  }

  async function handleAutocompleteSelect(suggestion: AddressSuggestion) {
    setStatus('loading')
    setError('')
    setResult(null)
    await lookupDistrict(suggestion.lat, suggestion.lon, suggestion.label)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address.trim()) return

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      const geocodeRes = await fetch(
        `/api/find-district/geocode?address=${encodeURIComponent(address)}`,
      )
      const geocodeData = await geocodeRes.json()

      if (!geocodeRes.ok) {
        setError(geocodeData.error || 'Could not look up that address.')
        setStatus('error')
        return
      }

      const { lat, lon, matchedAddress } = geocodeData
      await lookupDistrict(lat, lon, matchedAddress)
    } catch {
      setError('Something went wrong looking that up. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <AddressAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleAutocompleteSelect}
          placeholder="123 Main St, Hurricane, WV"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark disabled:opacity-60"
        >
          {status === 'loading' ? 'Searching…' : 'Find My District'}
        </button>
      </form>

      {status === 'error' && <p className="mt-4 text-sm text-brand-red">{error}</p>}

      {status === 'success' && result && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">{result.matchedAddress}</p>
            <div className="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-600">Magisterial District</span>
                <span className="font-semibold text-brand-navy">{result.magisterial}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-600">WV House</span>
                <a
                  href="https://www.wvlegislature.gov/house/roster.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-red hover:underline"
                >
                  District {result.house}
                </a>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-600">WV Senate</span>
                <a
                  href="https://www.wvlegislature.gov/Senate1/roster.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-red hover:underline"
                >
                  District {result.senate}
                </a>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-600">US Congressional</span>
                <span className="font-semibold text-brand-navy">
                  District {result.congressional}
                </span>
              </div>
            </div>
          </div>

          <div className="h-80 overflow-hidden rounded-lg border border-gray-200 lg:h-auto">
            <DistrictMap position={result.position} rings={result.rings} />
          </div>
        </div>
      )}
    </div>
  )
}
