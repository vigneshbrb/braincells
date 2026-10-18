import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useProfiles } from '../../store/profiles'
import { useProgress } from '../../store/progress'
import { ContinueRow } from './ContinueRow'

describe('ContinueRow Component', () => {
  beforeEach(() => {
    useProfiles.setState({ activeId: 'test-profile' })
    useProgress.setState({ progress: {} })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders nothing when there is no continue watching history', () => {
    const { container } = render(
      <MemoryRouter>
        <ContinueRow />
      </MemoryRouter>,
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders Continue Watching row with 40 percent bar when title is at 40 percent', () => {
    // 40 percent of 100 seconds
    useProgress.getState().setProgress('test-profile', 'deep-work-sprint', 40, 100)

    render(
      <MemoryRouter>
        <ContinueRow />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Continue Watching' })).toBeTruthy()
    expect(screen.getByText('Deep Work Sprint')).toBeTruthy()
    const progressBar = screen.getByTestId('poster-progress-bar')
    expect(progressBar).toBeTruthy()
  })

  it('removes title from row after 95 percent', () => {
    // First at 40 percent
    useProgress.getState().setProgress('test-profile', 'deep-work-sprint', 40, 100)

    const { rerender } = render(
      <MemoryRouter>
        <ContinueRow />
      </MemoryRouter>,
    )

    expect(screen.getByText('Deep Work Sprint')).toBeTruthy()

    // Pass 95 percent
    useProgress.getState().setProgress('test-profile', 'deep-work-sprint', 96, 100)

    rerender(
      <MemoryRouter>
        <ContinueRow />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Deep Work Sprint')).toBeNull()
  })
})
