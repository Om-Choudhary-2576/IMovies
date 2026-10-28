import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

describe('MovieCard Component', () => {
  const mockMovie = {
    _id: 'movie123',
    title: 'Interstellar',
    slug: 'interstellar',
    posterUrl: 'https://example.com/poster.jpg',
    genres: ['Sci-Fi', 'Adventure'],
    rating: 8.7,
    duration: 169,
    language: 'English',
    certification: 'PG-13',
    status: 'NOW_SHOWING',
    ticketPrice: { standard: 14.0, premium: 18.0, vip: 24.0 },
  };

  it('renders movie title, rating, language, genres, and Book Tickets button', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    expect(screen.getByText('Interstellar')).toBeInTheDocument();
    expect(screen.getByText('8.7')).toBeInTheDocument();
    expect(screen.getByText('169m')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('PG-13')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('Book Tickets')).toBeInTheDocument();
  });

  it('does NOT display any ticket price badges, tier pricing, or "From $" labels', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // Assert that no price badges or "From $" labels appear
    expect(screen.queryByText(/From \$/i)).toBeNull();
    expect(screen.queryByText(/Ticket Price/i)).toBeNull();
    expect(screen.queryByText(/\$14/)).toBeNull();
    expect(screen.queryByText(/\$18/)).toBeNull();
    expect(screen.queryByText(/\$24/)).toBeNull();
    expect(screen.queryByText(/\$12/)).toBeNull();
    expect(screen.queryByText('Standard')).toBeNull();
    expect(screen.queryByText('Premium')).toBeNull();
    expect(screen.queryByText('VIP')).toBeNull();
  });
});

