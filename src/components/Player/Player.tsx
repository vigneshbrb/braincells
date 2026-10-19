import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { byId } from '../../catalog'
import { useProfiles } from '../../store/profiles'
import { useProgress } from '../../store/progress'
import { useInsights } from '../../store/insights'
import { useProgressSave } from './useProgressSave'
import { IconButton } from '../IconButton/IconButton'

export function Player() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const getProgress = useProgress((state) => state.getProgress)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playStartedAt = useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const title = id ? byId(id) : undefined

  useProgressSave({
    profileId: activeProfileId,
    titleId: title?.id ?? '',
    videoRef,
    intervalMs: 5000,
  })

  if (!title) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-text">
        <h1 className="text-2xl font-bold">Title not found</h1>
        <button
          type="button"
          onClick={() => navigate('/browse')}
          className="rounded-control bg-accent px-4 py-2 font-medium text-text"
        >
          Back to Browse
        </button>
      </div>
    )
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
    const saved = getProgress(activeProfileId, title.id)
    if (saved && saved.position > 0 && saved.duration > 0 && saved.position / saved.duration < 0.95) {
      video.currentTime = saved.position
      setCurrentTime(saved.position)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value)
    const video = videoRef.current
    if (!video) return
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const trackStop = (type: 'pause' | 'complete') => {
    const startedAt = playStartedAt.current
    if (startedAt === null) return
    playStartedAt.current = null
    useInsights.getState().track({
      type,
      titleId: title.id,
      profileId: activeProfileId,
      seconds: Math.max(0, (Date.now() - startedAt) / 1000),
    })
  }

  return (
    <div data-testid="player-view" className="-mx-6 -mt-20 relative flex min-h-screen flex-col bg-background text-text">
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-6 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-4">
          <IconButton
            label="Back to browse"
            onClick={() => navigate('/browse')}
            className="bg-surface/80! hover:bg-surface text-xl"
          >
            ←
          </IconButton>
          <h1 className="font-heading text-xl font-bold">{title.name}</h1>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center">
        <video
          ref={videoRef}
          data-testid="player-video"
          src={title.trailerUrl}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => {
            setIsPlaying(true)
            playStartedAt.current = Date.now()
            useInsights.getState().track({ type: 'play', titleId: title.id, profileId: activeProfileId })
          }}
          onPause={() => {
            setIsPlaying(false)
            if (!videoRef.current?.ended) trackStop('pause')
          }}
          onEnded={() => { setIsPlaying(false); trackStop('complete') }}
          onClick={togglePlay}
          className="max-h-screen w-full object-contain cursor-pointer"
        />
      </div>

      <footer className="absolute bottom-0 inset-x-0 z-20 p-6 bg-gradient-to-t from-background/90 to-transparent space-y-3">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step="any"
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek progress"
          data-testid="player-seek-bar"
          className="w-full accent-highlight cursor-pointer"
        />
        <div className="flex items-center justify-between text-sm text-muted">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            data-testid="player-play-toggle"
            className="flex items-center gap-2 font-semibold text-text hover:text-highlight"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <span>
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </span>
        </div>
      </footer>
    </div>
  )
}
