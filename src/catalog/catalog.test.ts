import { describe, expect, it } from 'vitest'
import { byGenre, byId, featured, genres, posterStyle, titles } from '.'

describe('catalog schema', () => {
  it('has 30 titles with unique ids and trailers rotating over 5 MP4s', () => {
    expect(titles).toHaveLength(30)
    expect(new Set(titles.map((t) => t.id)).size).toBe(30)
    expect(new Set(titles.map((t) => t.trailerUrl)).size).toBe(5)
  })

  it.each(titles)('$id passes schema validation', (t) => {
    expect(t.id).toMatch(/^[a-z0-9-]+$/)
    expect(t.name.length).toBeGreaterThan(0)
    expect(Number.isInteger(t.year) && t.year > 1900).toBe(true)
    expect(['All', '7+', '13+']).toContain(t.maturity)
    expect(t.genres.length).toBeGreaterThan(0)
    t.genres.forEach((g) => expect(genres).toContain(g))
    expect(t.synopsis.length).toBeGreaterThan(0)
    expect(Number.isInteger(t.duration) && t.duration > 0).toBe(true)
    expect(t.trailerUrl).toMatch(/^https:\/\/.+\.mp4$/)
    expect(t.posterSeed.length).toBeGreaterThan(0)
    expect(typeof t.featured).toBe('boolean')
  })

  it('uses all 6 genres', () => {
    expect(new Set(titles.flatMap((t) => t.genres)).size).toBe(6)
  })
})

describe('selectors', () => {
  it('byGenre returns only titles tagged with that genre', () => {
    const focus = byGenre('Focus')
    expect(focus.length).toBeGreaterThan(0)
    focus.forEach((t) => expect(t.genres).toContain('Focus'))
    expect(focus).toHaveLength(titles.filter((t) => t.genres.includes('Focus')).length)
  })

  it('byId finds a title or returns undefined', () => {
    expect(byId('deep-work-sprint')?.name).toBe('Deep Work Sprint')
    expect(byId('missing')).toBeUndefined()
  })

  it('featured returns only featured titles', () => {
    const list = featured()
    expect(list.length).toBeGreaterThan(0)
    list.forEach((t) => expect(t.featured).toBe(true))
  })
})

describe('posterStyle', () => {
  it('is deterministic per seed and varies across seeds', () => {
    expect(posterStyle('abc')).toEqual(posterStyle('abc'))
    expect(posterStyle('abc').background).toMatch(/^linear-gradient\(/)
    const all = new Set(titles.map((t) => posterStyle(t.posterSeed).background))
    expect(all.size).toBe(titles.length)
  })
})
