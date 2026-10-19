import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from './App'
import { useAuth } from './store/auth'
import { useInsights } from './store/insights'

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it('shows Top 10 titles in rank order with visible numerals', async () => {
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', '/browse')
  render(<App />)

  const row = await screen.findByRole('region', { name: 'Top 10' })
  const cards = row.querySelectorAll('[data-testid="poster-card"]')
  expect(cards).toHaveLength(10)
  expect(Array.from(cards, (card) => card.getAttribute('aria-label'))).toEqual([
    'Deep Work Sprint', 'Growth Curve', 'Sleep Reset', 'Systems, Not Goals', 'The Quiet Hour',
    'The Reframe', 'Move Daily', 'The Blank Page', 'Attention Architects', 'Signal and Noise',
  ])
  expect(Array.from(row.querySelectorAll('[data-testid="top10-rank"]'), (rank) => rank.textContent))
    .toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
})

it('shows skeletons for 400 ms before browse content', () => {
  vi.useFakeTimers()
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', '/browse')
  render(<App />)

  expect(screen.getByRole('status', { name: 'Loading browse' })).toBeTruthy()
  expect(screen.queryByRole('region', { name: 'Top 10' })).toBeNull()
  act(() => vi.advanceTimersByTime(399))
  expect(screen.getByRole('status', { name: 'Loading browse' })).toBeTruthy()
  act(() => vi.advanceTimersByTime(1))
  expect(screen.queryByRole('status', { name: 'Loading browse' })).toBeNull()
  expect(screen.getByRole('region', { name: 'Top 10' })).toBeTruthy()
})

it('redirects the root path to sign in', async () => {
  useAuth.setState({ email: null })
  window.history.replaceState({}, '', '/')
  render(<App />)

  await waitFor(() => expect(window.location.pathname).toBe('/signin'))
  expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeTruthy()
})

it.each([
  ['/profiles', "Who's watching?"],
  ['/browse', 'Browse'],
  ['/watch/deep-work-sprint', 'Deep Work Sprint'],
  ['/insights', 'Insights'],
])('renders the %s placeholder', (path, heading) => {
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', path)
  render(<App />)

  expect(screen.getByRole('heading', { name: heading })).toBeTruthy()
  if (path === '/browse') {
    expect(screen.getByTestId('navbar')).toBeTruthy()
  }
})

it('shows a not-found page with a home link for unknown paths', () => {
  window.history.replaceState({}, '', '/missing')
  render(<App />)

  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Go home' }).getAttribute('href')).toBe('/')
})

it('shows search results for a matching query', () => {
  useInsights.setState({ events: [], region: 'Europe' })
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', '/browse/search?q=focus')
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Search results' })).toBeTruthy()
  expect(screen.getAllByTestId('poster-card').length).toBeGreaterThan(0)
  expect(useInsights.getState().events).toEqual([
    expect.objectContaining({ type: 'search', titleId: null, query: 'focus', region: 'Europe' }),
  ])
})

it('changes the region used for new events from settings', () => {
  useAuth.setState({ email: 'viewer@example.com' })
  useInsights.setState({ events: [], region: 'Asia Pacific' })
  window.history.replaceState({}, '', '/settings')
  render(<App />)

  fireEvent.change(screen.getByRole('combobox', { name: 'Region' }), { target: { value: 'Europe' } })
  useInsights.getState().track({ type: 'play', titleId: 'deep-work-sprint' })
  const events = useInsights.getState().events
  expect(events[events.length - 1]?.region).toBe('Europe')
})

it('shows separate region figures and accessible charts on Insights', () => {
  useAuth.setState({ email: 'viewer@example.com' })
  useInsights.setState({ events: [], region: 'Asia Pacific' })
  const { track, setRegion } = useInsights.getState()
  track({ type: 'play', titleId: 'deep-work-sprint' })
  track({ type: 'complete', titleId: 'deep-work-sprint', seconds: 120 })
  setRegion('Europe')
  track({ type: 'play', titleId: 'sleep-reset' })
  track({ type: 'pause', titleId: 'sleep-reset', seconds: 60 })
  window.history.replaceState({}, '', '/insights')
  render(<App />)

  const asia = within(screen.getByRole('region', { name: 'Asia Pacific' }))
  const europe = within(screen.getByRole('region', { name: 'Europe' }))
  expect(asia.getByText('2 min')).toBeTruthy()
  expect(asia.getByText('100%')).toBeTruthy()
  expect(europe.getByText('1 min')).toBeTruthy()
  expect(europe.getByText('0%')).toBeTruthy()
  expect(asia.getByRole('img', { name: 'Top genres in Asia Pacific' })).toBeTruthy()
  expect(europe.getByRole('img', { name: 'Ratings in Europe' })).toBeTruthy()
})

it('shows popular genre suggestions when search has no matches', () => {
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', '/browse/search?q=zzzz')
  render(<App />)
  expect(screen.getByText(/no titles found/i)).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Focus' })).toBeTruthy()
  fireEvent.click(screen.getByRole('link', { name: 'Focus' }))
  expect(screen.getByRole('searchbox', { name: 'Search titles' }).getAttribute('value')).toBe('Focus')
  expect(screen.getAllByTestId('poster-card').length).toBeGreaterThan(0)
})
