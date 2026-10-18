import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
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
  ['/profiles', 'Profiles'],
  ['/browse', 'Browse'],
  ['/watch/sample', 'Watch'],
  ['/insights', 'Insights'],
])('renders the %s placeholder', (path, heading) => {
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', path)
  render(<App />)

  expect(screen.getByRole('heading', { name: heading })).toBeTruthy()
})

it('shows a not-found page with a home link for unknown paths', () => {
  window.history.replaceState({}, '', '/missing')
  render(<App />)

  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Go home' }).getAttribute('href')).toBe('/')
})
