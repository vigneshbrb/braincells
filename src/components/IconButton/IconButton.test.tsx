import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { IconButton } from './IconButton'

afterEach(() => cleanup())

it('uses its label as the accessible name', () => {
  render(<IconButton label="Add to list">+</IconButton>)
  expect(screen.getByRole('button', { name: 'Add to list' })).toBeTruthy()
})
