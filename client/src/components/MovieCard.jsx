import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const fallbackPoster = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%23161c2b"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%238b5cf6" font-family="sans-serif" font-size="32">🎬</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14" font-weight="bold">IMOVIES</text></svg>';

  return (
    <div
      style={{
        background: 'rgba(15, 20, 31, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
      className="movie-card"
    >
      {/* Poster Image Container */}
      <Link
        to={`/movies/${movie.slug || movie._id}`}
        style={{ position: 'relative', overflow: 'hidden', display: 'block', aspectRatio: '2/3' }}
        aria-label={`View details for ${movie.title}`}
      >
        <img
          src={movie.posterUrl || fallbackPoster}
          alt={movie.title}
          onError={(e) => {
            if (e.target.src !== fallbackPoster) {
              e.target.src = fallbackPoster;
            }
          }}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="poster-img"
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, rgba(7, 9, 14, 0.2) 50%, rgba(7, 9, 14, 0) 100%)',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {movie.rating ? (
            <span className="badge-tag badge-rating">
              <Star size={12} fill="#fcd34d" color="#fcd34d" /> {movie.rating.toFixed(1)}
            </span>
          ) : (
            <span />
          )}

          {movie.certification && (
            <span className="badge-tag badge-cert">
              {movie.certification}
            </span>
          )}
        </div>

        {/* Movie Language & Duration Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#cbd5e1',
            fontSize: '0.78rem',
            pointerEvents: 'none',
          }}
        >
          {movie.language ? (
            <span style={{ fontWeight: 600 }}>{movie.language}</span>
          ) : (
            <span />
          )}
          {movie.duration ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {movie.duration}m
            </span>
          ) : null}
        </div>
      </Link>

      {/* Info Body */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Link to={`/movies/${movie.slug || movie._id}`}>
            <h3
              title={movie.title}
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                marginBottom: '8px',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#ffffff',
                transition: 'color 0.2s ease',
              }}
              className="movie-title-link"
            >
              {movie.title}
            </h3>
          </Link>

          {/* Genres */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '16px',
              minHeight: '22px',
            }}
          >
            {movie.genres?.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="badge-tag badge-genre">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/movies/${movie.slug || movie._id}`}
          className={movie.status === 'NOW_SHOWING' ? 'btn-primary' : 'btn-secondary'}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '0.86rem',
            textAlign: 'center',
            marginTop: 'auto',
          }}
        >
          <Ticket size={16} />
          {movie.status === 'NOW_SHOWING' ? 'Book Tickets' : 'Preview Details'}
        </Link>
      </div>

      <style>{`
        .movie-card:hover {
          transform: translateY(-6px);
          border-color: rgba(139, 92, 246, 0.45);
          box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.85), 0 0 20px rgba(139, 92, 246, 0.25);
        }
        .movie-card:hover .poster-img {
          transform: scale(1.05);
        }
        .movie-card:hover .movie-title-link {
          color: #c4b5fd;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
