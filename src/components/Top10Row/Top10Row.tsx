import { motion } from 'framer-motion'
import { titles, type Title } from '../../catalog'
import { useMotion } from '../../motion'
import { PosterCard } from '../PosterCard/PosterCard'
import { Row } from '../Row/Row'

const rankedTitles = titles
  .filter((title) => title.rank !== undefined)
  .sort((a, b) => a.rank! - b.rank!)

export interface Top10RowProps {
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
}

export function Top10Row({ onOpen }: Top10RowProps) {
  const { reduced } = useMotion()

  return (
    <Row
      title="Top 10"
      titles={rankedTitles}
      onOpen={onOpen}
      renderCard={(title, openerTabIndex) => (
        <div className={`relative flex h-52 items-end sm:h-72 ${title.rank === 10 ? 'pl-20 sm:pl-36' : 'pl-12 sm:pl-20'}`}>
          <motion.span
            data-testid="top10-rank"
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0, x: -32 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ WebkitTextStroke: '2px var(--text)' }}
            className="pointer-events-none absolute bottom-0 left-0 text-[7rem] font-black leading-none text-transparent sm:text-[10rem]"
          >
            {title.rank}
          </motion.span>
          <span className="sr-only">Rank {title.rank}</span>
          <PosterCard title={title} onOpen={onOpen} openerTabIndex={openerTabIndex} layoutId={`top10-${title.id}`} className="relative" />
        </div>
      )}
    />
  )
}
