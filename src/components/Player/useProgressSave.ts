import { useEffect } from 'react'
import { useProgress } from '../../store/progress'

interface UseProgressSaveOptions {
  profileId: string | null
  titleId: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  intervalMs?: number
}

export function useProgressSave({
  profileId,
  titleId,
  videoRef,
  intervalMs = 5000,
}: UseProgressSaveOptions) {
  const setProgress = useProgress((state) => state.setProgress)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !profileId || !titleId) return

    const saveCurrentProgress = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      setProgress(profileId, titleId, video.currentTime, video.duration)
    }

    const intervalId = window.setInterval(() => {
      if (!video.paused && !video.ended) {
        saveCurrentProgress()
      }
    }, intervalMs)

    video.addEventListener('pause', saveCurrentProgress)
    video.addEventListener('ended', saveCurrentProgress)

    return () => {
      window.clearInterval(intervalId)
      video.removeEventListener('pause', saveCurrentProgress)
      video.removeEventListener('ended', saveCurrentProgress)
      saveCurrentProgress()
    }
  }, [profileId, titleId, intervalMs, setProgress, videoRef])
}
