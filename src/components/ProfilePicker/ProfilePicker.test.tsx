import { afterEach, beforeEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { defaultProfiles, useProfiles } from '../../store/profiles'
import { ProfilePicker } from './ProfilePicker'

beforeEach(() => useProfiles.setState({ profiles: defaultProfiles, activeId: null }))
afterEach(() => cleanup())

function renderPicker() {
  render(
    <MemoryRouter initialEntries={['/profiles']}>
      <Routes>
        <Route path="/profiles" element={<ProfilePicker />} />
        <Route path="/browse" element={<h1>Browse</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

function addProfile(name: string) {
  fireEvent.click(screen.getByRole('button', { name: 'Add profile' }))
  fireEvent.change(screen.getByLabelText('Profile name'), { target: { value: name } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
}

it('selects a profile and opens browse', () => {
  renderPicker()
  fireEvent.click(screen.getByRole('button', { name: 'You' }))

  expect(useProfiles.getState().activeId).toBe('default')
  expect(screen.getByRole('heading', { name: 'Browse' })).toBeTruthy()
})

it('adds profiles and hides the add tile at five', () => {
  renderPicker()
  for (const name of ['Ana', 'Ben', 'Cy', 'Di']) addProfile(name)

  expect(useProfiles.getState().profiles).toHaveLength(5)
  expect(screen.getByRole('button', { name: 'Di' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Add profile' })).toBeNull()
})

it('deletes profiles but disables delete for the last one', () => {
  renderPicker()
  addProfile('Ana')
  fireEvent.click(screen.getByRole('button', { name: 'Delete Ana' }))

  expect(screen.queryByRole('button', { name: 'Ana' })).toBeNull()
  const remaining = screen.getByRole('button', { name: 'Delete You' }) as HTMLButtonElement
  expect(remaining.disabled).toBe(true)
  useProfiles.getState().removeProfile('default')
  expect(useProfiles.getState().profiles).toHaveLength(1)
})
