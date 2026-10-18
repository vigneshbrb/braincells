import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Button } from './Button'

afterEach(() => cleanup())

it('sets and clears its pressed state on pointer interaction', () => {
  render(<Button>Play</Button>)
  const button = screen.getByRole('button', { name: 'Play' })

  fireEvent.pointerDown(button)
  expect(button.getAttribute('data-pressed')).toBe('true')

  fireEvent.pointerUp(button)
  expect(button.getAttribute('data-pressed')).toBe('false')
})
