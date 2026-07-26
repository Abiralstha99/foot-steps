import { render, screen } from '@testing-library/react'
import { Button } from './button'
import { describe, it, expect } from 'vitest'

describe('Button forest variant', () => {
  it('renders without crashing', () => {
    render(<Button variant="forest">Start Free</Button>)
    expect(screen.getByRole('button', { name: 'Start Free' })).toBeTruthy()
  })

  it('applies gradient classes', () => {
    const { container } = render(<Button variant="forest">Go</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('from-green-600')
  })
})
