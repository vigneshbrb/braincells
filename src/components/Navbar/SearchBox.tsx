import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMotion } from '../../motion'
import { useDebounce } from './useDebounce'

export function SearchBox() {
  const location = useLocation()
  const navigate = useNavigate()
  const onSearchPage = location.pathname === '/browse/search'
  const urlQuery = new URLSearchParams(location.search).get('q') ?? ''
  const [expanded, setExpanded] = useState(onSearchPage)
  const [query, setQuery] = useState(onSearchPage ? urlQuery : '')
  const debounced = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastSearchRef = useRef(location.search)
  const { reduced } = useMotion()

  useEffect(() => {
    if (lastSearchRef.current !== location.search) {
      lastSearchRef.current = location.search
      setQuery(urlQuery)
      return
    }
    if (!expanded || !onSearchPage || debounced !== query || debounced === urlQuery) return
    const params = new URLSearchParams()
    if (debounced.trim()) params.set('q', debounced.trim())
    navigate(`/browse/search${params.size ? `?${params}` : ''}`, { replace: true })
  }, [debounced, expanded, location.search, navigate, onSearchPage, query, urlQuery])

  function open() {
    setQuery(onSearchPage ? urlQuery : '')
    setExpanded(true)
    navigate('/browse/search')
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  function close() {
    setExpanded(false)
    setQuery('')
    if (onSearchPage) navigate('/browse')
  }

  return (
    <div data-testid="search-slot" className="flex items-center">
      <button type="button" aria-label="Search" aria-expanded={expanded} onClick={open} className="rounded-control p-2 text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight">
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.input
            ref={inputRef}
            type="search"
            aria-label="Search titles"
            placeholder="Titles, genres, or topics"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Escape') close() }}
            initial={reduced ? false : { width: 0, opacity: 0 }}
            animate={{ width: 'min(45vw, 16rem)', opacity: 1 }}
            exit={reduced ? undefined : { width: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="min-w-0 rounded-control border border-white/20 bg-surface px-2 py-1 text-sm text-text outline-none focus-visible:border-highlight"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
