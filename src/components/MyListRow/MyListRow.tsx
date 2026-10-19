import { useMemo } from 'react'
import { byId, type Title } from '../../catalog'
import { useProfiles } from '../../store/profiles'
import { selectMyList, useMyList } from '../../store/myList'
import { PosterCard } from '../PosterCard/PosterCard'
import { Row } from '../Row/Row'

export interface MyListRowProps {
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
  className?: string
}

export function MyListRow({ onPlay, onAdd, onOpen, className = '' }: MyListRowProps) {
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const titleIds = useMyList(selectMyList(activeProfileId))
  const myListTitles = useMemo(
    () => (titleIds || []).map((id) => byId(id)).filter((title): title is Title => title !== undefined),
    [titleIds],
  )

  return (
    <Row
      title="My List"
      titles={myListTitles}
      className={className}
      renderCard={(title, openerTabIndex) => (
        <PosterCard
          title={title}
          onPlay={onPlay}
          onAdd={onAdd}
          onOpen={onOpen}
          openerTabIndex={openerTabIndex}
          layoutId={`mylist-${title.id}`}
        />
      )}
    />
  )
}
