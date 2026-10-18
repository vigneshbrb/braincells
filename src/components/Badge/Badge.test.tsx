import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Badge } from './Badge'

afterEach(() => cleanup())

it('renders its text as a noninteractive label', () => {
  render(<Badge>New</Badge>)
  expect(screen.getByText('New').tagName).toBe('SPAN')
  expect(screen.queryByRole('button')).toBeNull()
})
