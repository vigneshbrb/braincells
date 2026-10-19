import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { useAuth } from './store/auth'

afterEach(() => cleanup())

it('redirects the root path to sign in', async () => {
  useAuth.setState({ email: null })
  window.history.replaceState({}, '', '/')
  render(<App />)

  await waitFor(() => expect(window.location.pathname).toBe('/signin'))
  expect(screen.getByRole('heading', { name: 'Sign in' })).toBeTruthy()
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
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', '/browse/search?q=focus')
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Search results' })).toBeTruthy()
  expect(screen.getAllByTestId('poster-card').length).toBeGreaterThan(0)
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
