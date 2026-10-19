export const genres = ['Focus', 'Mindset', 'Health', 'Productivity', 'Relationships', 'Creativity'] as const

export type Genre = (typeof genres)[number]

export type Maturity = 'All' | '7+' | '13+'

export interface Title {
  id: string
  name: string
  year: number
  maturity: Maturity
  genres: Genre[]
  synopsis: string
  /** Runtime in minutes */
  duration: number
  trailerUrl: string
  posterSeed: string
  featured: boolean
  rank?: number
}
