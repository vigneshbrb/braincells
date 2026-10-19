import { regions, useInsights, type Region } from '../../store/insights'

export function Settings() {
  const region = useInsights((state) => state.region)
  const setRegion = useInsights((state) => state.setRegion)

  return (
    <section className="mx-auto max-w-2xl space-y-6 py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="space-y-2 rounded-card bg-surface p-6">
        <label htmlFor="region" className="block font-semibold">Region</label>
        <select
          id="region"
          value={region}
          onChange={(event) => setRegion(event.target.value as Region)}
          className="w-full rounded-control border border-white/20 bg-background px-3 py-2 text-text sm:w-72"
        >
          {regions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <p className="text-sm text-muted">New usage events are tagged with this region. Earlier events keep their original region.</p>
      </div>
    </section>
  )
}
