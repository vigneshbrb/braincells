import { motion } from 'framer-motion'
import { useMotion } from '../../motion'
import { aggregate, regions, useInsights } from '../../store/insights'

type Bar = { label: string; value: number }

function BarChart({ label, bars, color, unit }: { label: string; bars: Bar[]; color: string; unit: string }) {
  const { reduced } = useMotion()
  const max = Math.max(1, ...bars.map((bar) => bar.value))
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 320 ${bars.length * 34}`} className="w-full max-w-lg" preserveAspectRatio="xMinYMin meet">
      <title>{label}</title>
      {bars.map(({ label: name, value }, index) => (
        <g key={name} transform={`translate(0 ${index * 34})`}>
          <text x="0" y="18" fill="var(--text)" fontSize="12">{name}</text>
          <rect x="112" y="4" width="164" height="20" rx="4" fill="var(--background)" />
          <motion.rect
            x="112" y="4" height="20" rx="4" fill={color}
            initial={reduced ? { width: 164 * value / max } : { width: 0 }}
            animate={{ width: 164 * value / max }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : index * 0.08 }}
          />
          <text x="284" y="18" fill="var(--text)" fontSize="12">{value}{unit}</text>
        </g>
      ))}
    </svg>
  )
}

function minutes(seconds: number) {
  return seconds > 0 && seconds < 60 ? '<1 min' : `${Math.round(seconds / 60)} min`
}

export function Insights() {
  const events = useInsights((state) => state.events)

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted">Usage on this device, grouped by the region selected when each event was recorded.</p>
      </div>
      {regions.map((region) => {
        const data = aggregate(events, region)
        return (
          <section key={region} aria-label={region} className="space-y-5 rounded-card bg-surface p-5 sm:p-7">
            <h2 className="text-2xl font-bold">{region}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-control bg-background p-4">
                <h3 className="text-sm font-medium text-muted">Watch time</h3>
                <p className="mt-1 text-2xl font-bold">{minutes(data.watchSeconds)}</p>
              </div>
              <div className="rounded-control bg-background p-4">
                <h3 className="text-sm font-medium text-muted">Completion rate</h3>
                <p className="mt-1 text-2xl font-bold">{data.completionRate}%</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Top genres</h3>
                {data.topGenres.length ? (
                  <BarChart label={`Top genres in ${region}`} bars={data.topGenres.map(({ genre, seconds }) => ({ label: genre, value: Math.round(seconds) }))} color="var(--accent)" unit="s" />
                ) : <p className="text-sm text-muted">No watch time yet.</p>}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Ratings</h3>
                <BarChart label={`Ratings in ${region}`} bars={[
                  { label: 'Down', value: data.ratings.down },
                  { label: 'Up', value: data.ratings.up },
                  { label: 'Double up', value: data.ratings['double-up'] },
                ]} color="var(--highlight)" unit="" />
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
