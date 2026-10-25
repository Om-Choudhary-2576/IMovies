import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

  return (
    <div style={{
      background: 'rgba(15, 20, 31, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'relative',
    }}
    className="movie-card"
    >
      {/* Poster Image Container */}
      <Link to={`/movies/${movie.slug || movie._id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block', aspectRatio: '2/3' }}>
        <img
          src={movie.posterUrl || fallbackPoster}
          alt={movie.title}
          onError={(e) => { e.target.src = fallbackPoster; }}
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
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, rgba(7, 9, 14, 0) 50%)',
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          {movie.rating ? (
            <span className="badge-tag badge-rating">
              <Star size={12} fill="#fcd34d" color="#fcd34d" /> {movie.rating.toFixed(1)}
            </span>
          ) : <span />}

          <span className="badge-tag badge-cert">
            {movie.certification || 'PG-13'}
          </span>
        </div>

        {/* Movie Language & Duration on hover */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#cbd5e1',
          fontSize: '0.78rem',
        }}>
          <span style={{ fontWeight: 600 }}>{movie.language}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {movie.duration}m
          </span>
        </div>
      </Link>

      {/* Info Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <Link to={`/movies/${movie.slug || movie._id}`}>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              marginBottom: '8px',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {movie.title}
            </h3>
          </Link>

          {/* Genres */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
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
          }}
        >
          <Ticket size={16} />
          {movie.status === 'NOW_SHOWING' ? 'Book Tickets' : 'Preview Details'}
        </Link>
      </div>

      <style>{`
        .movie-card:hover {
          transform: translateY(-6px);
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(139, 92, 246, 0.2);
        }
        .movie-card:hover .poster-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
