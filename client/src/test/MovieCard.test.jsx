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
  };

  it('renders movie title, rating, and duration correctly', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    expect(screen.getByText('Interstellar')).toBeInTheDocument();
    expect(screen.getByText('8.7')).toBeInTheDocument();
    expect(screen.getByText('169m')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Book Tickets')).toBeInTheDocument();
  });

  it('renders ticket price and tier breakdowns correctly', () => {
    const movieWithCustomPrice = {
      ...mockMovie,
      ticketPrice: { standard: 14.0, premium: 18.0, vip: 24.0 },
    };

    render(
      <BrowserRouter>
        <MovieCard movie={movieWithCustomPrice} />
      </BrowserRouter>
    );

    expect(screen.getAllByText('From $14.00').length).toBeGreaterThan(0);
    expect(screen.getByText('$14')).toBeInTheDocument();
    expect(screen.getByText('$18')).toBeInTheDocument();
    expect(screen.getByText('$24')).toBeInTheDocument();
  });
});
