import { describe, expect, it } from 'vitest'
import { byGenre, byId, featured, genres, posterStyle, search, titles } from '.'

describe('catalog schema', () => {
  it('contains exactly one title for each Top 10 rank', () => {
    expect(titles.filter((title) => title.rank !== undefined).map((title) => title.rank).sort((a, b) => a! - b!))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  it('has 30 titles with unique ids and three demo video sources', () => {
    expect(titles).toHaveLength(30)
    expect(new Set(titles.map((t) => t.id)).size).toBe(30)
    expect(new Set(titles.map((t) => t.trailerUrl)).size).toBe(3)
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
  it('ranks name matches before genre and synopsis matches, ignoring case', () => {
    const results = search('FOCUS')
    expect(results.length).toBeGreaterThan(0)
    const nameMatches = results.filter((title) => title.name.toLowerCase().includes('focus'))
    expect(results.slice(0, nameMatches.length)).toEqual(nameMatches)
    expect(results.some((title) => title.genres.includes('Focus'))).toBe(true)
  })

  it('returns no results for blank or unmatched queries', () => {
    expect(search('   ')).toEqual([])
    expect(search('zzzz')).toEqual([])
  })

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
