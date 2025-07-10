import { render, screen, act } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock supabaseClient
const mockSupabase = {
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn((_event, callback) => {
      // Simulate initial state
      // setTimeout(() => callback('INITIAL_SESSION', null), 0);
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    }),
  },
};
vi.mock('../supabaseClient', () => ({
  supabase: mockSupabase,
}));

// Mock global fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Mocked response' }),
    ok: true,
  })
);

describe('App', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSupabase.auth.getSession.mockClear().mockResolvedValue({ data: { session: null }, error: null });
    mockSupabase.auth.onAuthStateChange.mockClear().mockImplementation((_event, callback) => {
      // setTimeout(() => callback('INITIAL_SESSION', null), 0);
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });
    global.fetch.mockClear().mockResolvedValue({
        json: () => Promise.resolve({ message: 'Mocked response' }),
        ok: true,
    });
  });

  it('renders the Redis test section when no user is logged in', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    // Use findByText for elements that might appear asynchronously
    expect(await screen.findByText(/Redis Test \(via Auth Service\)/i)).toBeInTheDocument();
  });
});
