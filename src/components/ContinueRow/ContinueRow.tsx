import { titles, type Title } from '../../catalog'
import { useProfiles } from '../../store/profiles'
import { getContinueWatchingList, useProgress } from '../../store/progress'
import { PosterCard } from '../PosterCard/PosterCard'
import { Row } from '../Row/Row'

export interface ContinueRowProps {
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
  className?: string
}

export function ContinueRow({ onPlay, onAdd, onOpen, className = '' }: ContinueRowProps) {
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const progressMap = useProgress((state) => state.progress)
  const items = getContinueWatchingList(progressMap[activeProfileId], titles)
  const percentageById = new Map(items.map(({ title, percentage }) => [title.id, percentage]))

  return (
    <Row
      title="Continue Watching"
      titles={items.map(({ title }) => title)}
      className={className}
      renderCard={(title, openerTabIndex) => (
        <PosterCard
          title={title}
          progress={percentageById.get(title.id)}
          onPlay={onPlay}
          onAdd={onAdd}
          onOpen={onOpen}
          openerTabIndex={openerTabIndex}
          layoutId={`continue-${title.id}`}
        />
      )}
    />
  )
}
