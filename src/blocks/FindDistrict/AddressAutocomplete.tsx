'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  PUTNAM_COUNTY_LAT,
  PUTNAM_COUNTY_LON,
  formatPhotonAddress,
  type PhotonProperties,
} from '@/utilities/geocoding'

export type AddressSuggestion = {
  label: string
  lat: number
  lon: number
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  placeholder?: string
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const url = new URL('https://photon.komoot.io/api/')
        url.searchParams.set('q', query)
        url.searchParams.set('limit', '5')
        url.searchParams.set('lat', String(PUTNAM_COUNTY_LAT))
        url.searchParams.set('lon', String(PUTNAM_COUNTY_LON))

        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()

        const results: AddressSuggestion[] = (data.features ?? [])
          .filter((f: { properties?: PhotonProperties }) => f.properties?.street || f.properties?.name)
          .map((f: { properties: PhotonProperties; geometry: { coordinates: [number, number] } }) => ({
            label: formatPhotonAddress(f.properties),
            lon: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          }))

        setSuggestions(results)
        setOpen(results.length > 0)
        setActiveIndex(-1)
      } catch {
        setSuggestions([])
      }
    }, 300)
  }, [])

  function handleSelect(suggestion: AddressSuggestion) {
    onChange(suggestion.label)
    onSelect(suggestion)
    setOpen(false)
    setSuggestions([])
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          fetchSuggestions(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-navy focus:outline-none"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.lat},${suggestion.lon}`}>
              <button
                type="button"
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`block w-full px-4 py-2.5 text-left text-sm ${
                  index === activeIndex ? 'bg-gray-100' : ''
                } hover:bg-gray-100`}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
