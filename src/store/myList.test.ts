import { beforeEach, describe, expect, it } from 'vitest'
import { useMyList } from './myList'
import { useInsights } from './insights'

describe('My List Store', () => {
  beforeEach(() => {
    useMyList.getState().clearList()
    useInsights.setState({ events: [], region: 'Europe' })
  })

  it('toggles a title into and out of the list', () => {
    const { toggleTitle, isInList, getList } = useMyList.getState()

    // Add title
    toggleTitle('profile-1', 'deep-work-sprint')
    expect(isInList('profile-1', 'deep-work-sprint')).toBe(true)
    expect(getList('profile-1').length).toBe(1)

    // Remove title
    toggleTitle('profile-1', 'deep-work-sprint')
    expect(isInList('profile-1', 'deep-work-sprint')).toBe(false)
    expect(getList('profile-1').length).toBe(0)
    expect(useInsights.getState().events.filter((event) => event.type === 'add').map((event) => event.titleId))
      .toEqual(['deep-work-sprint'])
  })

  it('persists list across profile isolation', () => {
    const { toggleTitle, isInList, getList } = useMyList.getState()

    // Add to profile-1
    toggleTitle('profile-1', 'deep-work-sprint')
    expect(isInList('profile-1', 'deep-work-sprint')).toBe(true)

    // Profile-2 should not have the title
    expect(isInList('profile-2', 'deep-work-sprint')).toBe(false)
    expect(getList('profile-2').length).toBe(0)

    // Profile-1 still has the title
    expect(getList('profile-1').length).toBe(1)
    expect(getList('profile-1')[0].id).toBe('deep-work-sprint')
  })

  it('adds and removes titles explicitly', () => {
    const { addTitle, removeTitle, isInList, getList } = useMyList.getState()

    addTitle('profile-1', 'deep-work-sprint')
    expect(isInList('profile-1', 'deep-work-sprint')).toBe(true)

    addTitle('profile-1', 'the-quiet-hour')
    expect(getList('profile-1').length).toBe(2)

    removeTitle('profile-1', 'deep-work-sprint')
    expect(isInList('profile-1', 'deep-work-sprint')).toBe(false)
    expect(getList('profile-1').length).toBe(1)
    expect(getList('profile-1')[0].id).toBe('the-quiet-hour')
  })

  it('does not duplicate on repeated add', () => {
    const { addTitle, getList } = useMyList.getState()

    addTitle('profile-1', 'deep-work-sprint')
    addTitle('profile-1', 'deep-work-sprint')
    addTitle('profile-1', 'deep-work-sprint')

    expect(getList('profile-1').length).toBe(1)
  })

  it('returns empty list for unknown profile', () => {
    const { getList } = useMyList.getState()
    expect(getList('unknown-profile')).toEqual([])
  })

  it('returns empty list for unknown title id', () => {
    const { toggleTitle, isInList, getList } = useMyList.getState()

    toggleTitle('profile-1', 'nonexistent-title')
    expect(isInList('profile-1', 'nonexistent-title')).toBe(true)
    expect(getList('profile-1').length).toBe(0)
  })
})
