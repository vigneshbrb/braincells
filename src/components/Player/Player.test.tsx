import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useProfiles } from '../../store/profiles'
import { useProgress } from '../../store/progress'
import { Player } from './Player'

describe('Player Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useProfiles.setState({ activeId: 'test-profile' })
    useProgress.setState({ progress: {} })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders player and saves progress every 5 seconds during playback', () => {
    render(
      <MemoryRouter initialEntries={['/watch/deep-work-sprint']}>
        <Routes>
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Deep Work Sprint' })).toBeTruthy()

    const video = screen.getByTestId('player-video') as HTMLVideoElement
    Object.defineProperty(video, 'duration', { value: 100, configurable: true })
    Object.defineProperty(video, 'currentTime', { value: 30, writable: true, configurable: true })
    Object.defineProperty(video, 'paused', { value: false, writable: true, configurable: true })

    // Simulate 5 seconds pass during playback
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    const saved = useProgress.getState().getProgress('test-profile', 'deep-work-sprint')
    expect(saved).toBeDefined()
    expect(saved?.position).toBe(30)
    expect(saved?.duration).toBe(100)
  })

  it('saves progress on pause', () => {
    render(
      <MemoryRouter initialEntries={['/watch/deep-work-sprint']}>
        <Routes>
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>,
    )

    const video = screen.getByTestId('player-video') as HTMLVideoElement
    Object.defineProperty(video, 'duration', { value: 100, configurable: true })
    Object.defineProperty(video, 'currentTime', { value: 15, writable: true, configurable: true })

    fireEvent.pause(video)

    const saved = useProgress.getState().getProgress('test-profile', 'deep-work-sprint')
    expect(saved).toBeDefined()
    expect(saved?.position).toBe(15)
  })

  it('resumes video from saved position when below 95 percent', () => {
    useProgress.getState().setProgress('test-profile', 'deep-work-sprint', 40, 100)

    render(
      <MemoryRouter initialEntries={['/watch/deep-work-sprint']}>
        <Routes>
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>,
    )

    const video = screen.getByTestId('player-video') as HTMLVideoElement
    Object.defineProperty(video, 'duration', { value: 100, configurable: true })

    fireEvent.loadedMetadata(video)

    expect(video.currentTime).toBe(40)
  })

  it('does not seek backward when progress is saved during continued playback', () => {
    useProgress.getState().setProgress('test-profile', 'deep-work-sprint', 40, 100)

    render(
      <MemoryRouter initialEntries={['/watch/deep-work-sprint']}>
        <Routes>
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>,
    )

    const video = screen.getByTestId('player-video') as HTMLVideoElement
    Object.defineProperty(video, 'duration', { value: 100, configurable: true })
    fireEvent.loadedMetadata(video)
    expect(video.currentTime).toBe(40)

    act(() => {
      useProgress.getState().setProgress('test-profile', 'deep-work-sprint', 45, 100)
      video.currentTime = 50
    })

    expect(video.currentTime).toBe(50)
  })

  it('saves the same playback position separately for two profiles', () => {
    render(
      <MemoryRouter initialEntries={['/watch/deep-work-sprint']}>
        <Routes>
          <Route path="/watch/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>,
    )

    const video = screen.getByTestId('player-video') as HTMLVideoElement
    Object.defineProperty(video, 'duration', { value: 100, configurable: true })
    Object.defineProperty(video, 'currentTime', { value: 15, writable: true, configurable: true })
    fireEvent.pause(video)

    act(() => useProfiles.setState({ activeId: 'other-profile' }))
    fireEvent.pause(video)

    expect(useProgress.getState().getProgress('test-profile', 'deep-work-sprint')?.position).toBe(15)
    expect(useProgress.getState().getProgress('other-profile', 'deep-work-sprint')?.position).toBe(15)
  })
})
