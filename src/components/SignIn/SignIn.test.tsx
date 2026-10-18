import { afterEach, beforeEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../store/auth'
import { SignIn } from './SignIn'

beforeEach(() => useAuth.setState({ email: null }))
afterEach(() => cleanup())

function renderSignIn() {
  render(
    <MemoryRouter initialEntries={['/signin']}>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profiles" element={<h1>Profiles</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

function submit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
}

it('signs in with valid credentials and goes to profiles', () => {
  renderSignIn()
  submit('viewer@example.com', 'secret1')

  expect(useAuth.getState().email).toBe('viewer@example.com')
  expect(screen.getByRole('heading', { name: 'Profiles' })).toBeTruthy()
})

it('shows an inline error and stays put for an invalid email', () => {
  renderSignIn()
  submit('not-an-email', 'secret1')

  expect(screen.getByRole('alert').textContent).toMatch(/valid email/)
  expect(useAuth.getState().email).toBeNull()
  expect(screen.getByRole('heading', { name: 'Sign in' })).toBeTruthy()
})

it('rejects passwords shorter than 6 characters', () => {
  renderSignIn()
  submit('viewer@example.com', '12345')

  expect(screen.getByRole('alert').textContent).toMatch(/at least 6/)
  expect(useAuth.getState().email).toBeNull()
})
