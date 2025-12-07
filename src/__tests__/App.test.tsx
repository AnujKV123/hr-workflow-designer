import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { ToastProvider } from '../contexts/ToastContext'

describe('App', () => {
  it('renders the app title', () => {
    render(
      <ToastProvider>
        <App />
      </ToastProvider>
    )
    expect(screen.getByText('HR Workflow Designer')).toBeInTheDocument()
  })
})
