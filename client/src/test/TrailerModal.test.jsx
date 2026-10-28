import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrailerModal from '../components/TrailerModal';

describe('TrailerModal Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Dune: Part Two',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=U2Qp5pL3ovA',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<TrailerModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal with movie title and YouTube iframe when open', () => {
    render(<TrailerModal {...defaultProps} />);

    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
    expect(screen.getByText(/Official Trailer/i)).toBeInTheDocument();

    const iframe = screen.getByTitle('Dune: Part Two Official Trailer');
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain('https://www.youtube.com/embed/Way9Dexny3w');
    expect(iframe.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin');
    expect(iframe.getAttribute('allow')).toContain('accelerometer; autoplay; clipboard-write; encrypted-media');
  });

  it('provides safe external YouTube link with rel="noopener noreferrer"', () => {
    render(<TrailerModal {...defaultProps} />);

    const externalLinks = screen.getAllByRole('link', { name: /YouTube/i });
    expect(externalLinks.length).toBeGreaterThan(0);
    expect(externalLinks[0]).toHaveAttribute('href', 'https://www.youtube.com/watch?v=Way9Dexny3w');
    expect(externalLinks[0]).toHaveAttribute('target', '_blank');
    expect(externalLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('allows switching to alternative trailer when available', () => {
    render(<TrailerModal {...defaultProps} />);

    const altButton = screen.getByRole('button', { name: /Try Another Trailer/i });
    expect(altButton).toBeInTheDocument();

    fireEvent.click(altButton);

    // After clicking, iframe should switch to the alternative video ID
    const iframe = screen.getByTitle('Dune: Part Two Official Trailer');
    expect(iframe.src).toContain('https://www.youtube.com/embed/U2Qp5pL3ovA');
    expect(screen.getByText(/Alternative Trailer/i)).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    render(<TrailerModal {...defaultProps} />);

    const closeButton = screen.getByLabelText(/Close trailer/i);
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders graceful error state when given an invalid trailer URL', () => {
    render(
      <TrailerModal
        isOpen={true}
        title="Invalid Movie"
        trailerUrl="not-a-valid-url"
        onClose={defaultProps.onClose}
      />
    );

    expect(screen.getByText(/Trailer Playback Unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/No valid trailer video source found/i)).toBeInTheDocument();
  });

  it('shows Error 151 assistance and advice when restriction is reported', () => {
    render(<TrailerModal {...defaultProps} />);

    const reportBtn = screen.getByText(/Video not playing or restricted \(Error 151\)\?/i);
    fireEvent.click(reportBtn);

    expect(screen.getByText(/Restricted Playback Environment \(Error 151\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Workspace or Network Policy/i)).toBeInTheDocument();
  });
});
