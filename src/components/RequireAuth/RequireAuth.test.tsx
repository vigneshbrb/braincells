import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../store/auth'
import { RequireAuth } from './RequireAuth'

afterEach(() => cleanup())

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/signin" element={<h1>Sign in</h1>} />
        <Route path="/browse" element={<RequireAuth><h1>Browse</h1></RequireAuth>} />
      </Routes>
    </MemoryRouter>,
  )
}

it('redirects signed-out users to sign in', () => {
  useAuth.setState({ email: null })
  renderAt('/browse')

  expect(screen.getByRole('heading', { name: 'Sign in' })).toBeTruthy()
})

it('renders protected content for signed-in users', () => {
  useAuth.setState({ email: 'viewer@example.com' })
  renderAt('/browse')

  expect(screen.getByRole('heading', { name: 'Browse' })).toBeTruthy()
})
