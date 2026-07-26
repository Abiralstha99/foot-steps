import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { LandingPage } from './LandingPage'

// Clerk mock — Clerk hooks/components are not available in jsdom
vi.mock('@clerk/clerk-react', () => ({
  SignedIn:     ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut:    ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useUser:      () => ({ user: null }),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) =>
      <div {...p}>{children}</div>,
  },
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('LandingPage', () => {
  it('renders the Footprint brand name', () => {
    render(<LandingPage />, { wrapper: Wrapper })
    expect(screen.getAllByText('Footprint').length).toBeGreaterThan(0)
  })

  it('renders the hero headline', () => {
    render(<LandingPage />, { wrapper: Wrapper })
    expect(screen.getByText(/mapped/i)).toBeTruthy()
  })

  it('renders all three feature card titles', () => {
    render(<LandingPage />, { wrapper: Wrapper })
    expect(screen.getByText('Automatic Mapping')).toBeTruthy()
    expect(screen.getByText('AI Landmark Tagging')).toBeTruthy()
    expect(screen.getByText('Day-by-Day Timeline')).toBeTruthy()
  })

  it('renders the CTA section heading', () => {
    render(<LandingPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Turn your next trip/i)).toBeTruthy()
  })

  it('has a features anchor target', () => {
    render(<LandingPage />, { wrapper: Wrapper })
    expect(document.getElementById('features')).toBeTruthy()
  })
})
