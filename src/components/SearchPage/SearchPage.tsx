import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { genres, search, type Title } from '../../catalog'
import { useMotion } from '../../motion'
import { useInsights } from '../../store/insights'
import { PosterCard } from '../PosterCard/PosterCard'
import { TitleModal } from '../TitleModal/TitleModal'

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const results = search(query)
  const [selected, setSelected] = useState<{ title: Title; opener: HTMLElement; layoutId: string } | null>(null)
  const { fadeUp, stagger } = useMotion()
  const lastTracked = useRef('')

  useEffect(() => {
    if (query && lastTracked.current !== query) {
      useInsights.getState().track({ type: 'search', titleId: null, query })
    }
    lastTracked.current = query
  }, [query])

  return (
    <section className="space-y-6 pb-12">
      <h1 className="font-heading text-3xl font-bold">Search results</h1>
      {query ? (
        <p className="text-muted">{results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”</p>
      ) : (
        <p className="text-muted">Search titles, genres, or topics.</p>
      )}
      {results.length > 0 && (
        <motion.div initial="initial" animate="animate" variants={stagger} className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4">
          {results.map((title) => (
            <motion.div key={title.id} variants={fadeUp}>
              <PosterCard
                title={title}
                layoutId={`search-${title.id}`}
                onOpen={(chosen, opener, layoutId) => setSelected({ title: chosen, opener, layoutId })}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      {query && results.length === 0 && (
        <div className="space-y-3 text-muted">
          <p>No titles found. Try a popular genre:</p>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <Link key={genre} to={`/browse/search?q=${encodeURIComponent(genre)}`} className="rounded-control bg-surface px-3 py-2 text-text hover:text-accent focus-visible:outline-2 focus-visible:outline-highlight">
                {genre}
              </Link>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {selected && (
          <TitleModal
            title={selected.title}
            layoutId={selected.layoutId}
            opener={selected.opener}
            onClose={() => setSelected(null)}
            onSelect={(title) => setSelected({ ...selected, title, layoutId: '' })}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
