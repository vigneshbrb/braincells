import data from './catalog.json'
import type { Genre, Title } from './types'

export { genres } from './types'
export type { Genre, Maturity, Title } from './types'

export const titles = data as Title[]

export function byId(id: string): Title | undefined {
  return titles.find((title) => title.id === id)
}

export function byGenre(genre: Genre): Title[] {
  return titles.filter((title) => title.genres.includes(genre))
}

export function featured(): Title[] {
  return titles.filter((title) => title.featured)
}

export function search(query: string): Title[] {
  const term = query.trim().toLowerCase()
  if (!term) return []
  return titles
    .map((title, index) => {
      const rank = title.name.toLowerCase().includes(term) ? 0
        : title.genres.some((genre) => genre.toLowerCase().includes(term)) ? 1
          : title.synopsis.toLowerCase().includes(term) ? 2 : 3
      return { title, index, rank }
    })
    .filter(({ rank }) => rank < 3)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ title }) => title)
}

function hash(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function posterStyle(seed: string): { background: string } {
  const h = hash(seed)
  const hue = h % 360
  const shift = 40 + ((h >>> 9) % 80)
  const angle = (h >>> 17) % 360
  return {
    background: `linear-gradient(${angle}deg, hsl(${hue} 70% 45%), hsl(${(hue + shift) % 360} 65% 18%))`,
  }
}
