import { beforeEach, describe, expect, it } from 'vitest'
import { titles } from '../catalog'
import { getContinueWatchingList, useProgress } from './progress'

describe('Progress Store', () => {
  beforeEach(() => {
    useProgress.setState({ progress: {} })
  })

  it('saves progress keyed by profile and title', () => {
    const { setProgress, getProgress } = useProgress.getState()

    setProgress('profile-1', 'deep-work-sprint', 30, 100)

    const saved = getProgress('profile-1', 'deep-work-sprint')
    expect(saved).toBeDefined()
    expect(saved?.position).toBe(30)
    expect(saved?.duration).toBe(100)

    // Other profile has no progress
    expect(getProgress('profile-2', 'deep-work-sprint')).toBeUndefined()
  })

  it('resumes with saved position when below 95 percent', () => {
    const { setProgress } = useProgress.getState()

    // 40 percent progress
    setProgress('profile-1', 'deep-work-sprint', 40, 100)

    const list = getContinueWatchingList(
      useProgress.getState().progress['profile-1'],
      titles,
    )

    expect(list.length).toBe(1)
    expect(list[0].title.id).toBe('deep-work-sprint')
    expect(list[0].percentage).toBe(40)
  })

  it('removes title from progress when progress reaches or exceeds 95 percent', () => {
    const { setProgress, getProgress } = useProgress.getState()

    // Save initial progress
    setProgress('profile-1', 'deep-work-sprint', 40, 100)
    expect(getProgress('profile-1', 'deep-work-sprint')).toBeDefined()

    // Reaches 95 percent
    setProgress('profile-1', 'deep-work-sprint', 95, 100)
    expect(getProgress('profile-1', 'deep-work-sprint')).toBeUndefined()

    const list = getContinueWatchingList(
      useProgress.getState().progress['profile-1'],
      titles,
    )
    expect(list.length).toBe(0)
  })

  it('removes progress explicitly via removeProgress', () => {
    const { setProgress, removeProgress, getProgress } = useProgress.getState()

    setProgress('profile-1', 'the-quiet-hour', 10, 100)
    expect(getProgress('profile-1', 'the-quiet-hour')).toBeDefined()

    removeProgress('profile-1', 'the-quiet-hour')
    expect(getProgress('profile-1', 'the-quiet-hour')).toBeUndefined()
  })
})
