import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useAuth } from '../../store/auth'
import { useProfiles } from '../../store/profiles'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

beforeEach(() => {
  useAuth.setState({ email: 'user@example.com' })
  useProfiles.setState({
    profiles: [
      { id: 'default', name: 'You' },
      { id: 'kid', name: 'Kid' },
    ],
    activeId: 'default',
  })
  window.scrollY = 0
})

it('renders logo, navigation links, and search slot', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: 'BrainCells' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Browse' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Insights' })).toBeTruthy()
  expect(screen.getByTestId('search-slot')).toBeTruthy()
})

it('expands search and updates the search URL after 300 ms of inactivity', () => {
  vi.useFakeTimers()
  function Location() {
    const location = useLocation()
    return <output data-testid="location">{location.pathname + location.search}</output>
  }
  render(
    <MemoryRouter initialEntries={['/browse']}>
      <Navbar />
      <Location />
      <Routes>
        <Route path="/browse" element={<div>Browse page</div>} />
        <Route path="/browse/search" element={<div>Search page</div>} />
      </Routes>
    </MemoryRouter>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
  const input = screen.getByRole('searchbox', { name: 'Search titles' })
  fireEvent.change(input, { target: { value: 'fo' } })
  act(() => vi.advanceTimersByTime(200))
  fireEvent.change(input, { target: { value: 'focus' } })
  act(() => vi.advanceTimersByTime(299))
  expect(screen.getByTestId('location').textContent).not.toContain('focus')
  act(() => vi.advanceTimersByTime(1))
  expect(screen.getByTestId('location').textContent).toBe('/browse/search?q=focus')
})

it('toggles scroll state and background class past 40px scroll', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  )

  const navbar = screen.getByTestId('navbar')
  expect(navbar.getAttribute('data-scrolled')).toBe('false')
  expect(navbar.className).toContain('bg-transparent')

  act(() => {
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true })
    window.dispatchEvent(new Event('scroll'))
  })

  expect(navbar.getAttribute('data-scrolled')).toBe('true')
  expect(navbar.className).toContain('bg-surface/90')

  act(() => {
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true })
    window.dispatchEvent(new Event('scroll'))
  })

  expect(navbar.getAttribute('data-scrolled')).toBe('false')
})

it('opens profile dropdown and allows switching profile', async () => {
  render(
    <MemoryRouter initialEntries={['/browse']}>
      <Routes>
        <Route path="/browse" element={<Navbar />} />
        <Route path="/profiles" element={<h1>Profiles</h1>} />
      </Routes>
    </MemoryRouter>,
  )

  const profileButton = screen.getByRole('button', { name: 'Profile menu' })
  expect(profileButton.getAttribute('aria-expanded')).toBe('false')

  fireEvent.click(profileButton)
  expect(profileButton.getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByRole('menu', { name: 'Profile options' })).toBeTruthy()
  expect(screen.getByRole('menuitem', { name: 'Switch profile' })).toBeTruthy()
  expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeTruthy()

  fireEvent.click(screen.getByRole('menuitem', { name: 'Switch profile' }))
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Profiles' })).toBeTruthy())
})

it('clears auth and navigates to /signin on sign out', async () => {
  render(
    <MemoryRouter initialEntries={['/browse']}>
      <Routes>
        <Route path="/browse" element={<Navbar />} />
        <Route path="/signin" element={<h1>Sign in</h1>} />
      </Routes>
    </MemoryRouter>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Profile menu' }))
  fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }))

  expect(useAuth.getState().email).toBeNull()
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Sign in' })).toBeTruthy())
})

it('closes profile menu on Escape and click outside', async () => {
  render(
    <MemoryRouter initialEntries={['/browse']}>
      <div>
        <div data-testid="outside">Outside</div>
        <Navbar />
      </div>
    </MemoryRouter>,
  )

  const profileButton = screen.getByRole('button', { name: 'Profile menu' })
  fireEvent.click(profileButton)
  expect(screen.getByRole('menu')).toBeTruthy()

  fireEvent.keyDown(document, { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

  fireEvent.click(profileButton)
  expect(screen.getByRole('menu')).toBeTruthy()

  fireEvent.mouseDown(screen.getByTestId('outside'))
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
})
