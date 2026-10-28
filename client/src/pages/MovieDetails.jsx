import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Play,
  Ticket,
  MapPin,
  Sparkles,
  Users,
  Film,
  ChevronRight,
} from 'lucide-react';
import { moviesApi, showsApi } from '../services/api';
import { useBooking } from '../context/BookingContext';
import TrailerModal from '../components/TrailerModal';
import { ShowListSkeleton } from '../components/LoadingSkeleton';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShow } = useBooking();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Generate 5 days of dates starting today
  useEffect(() => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ date: dateStr, label });
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].date);
    }
  }, []);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await moviesApi.getMovieById(id);
        if (res.success) {
          setMovie(res.data);
          setSelectedMovie(res.data);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch shows when movie and selectedDate are ready
  useEffect(() => {
    if (!movie?._id || !selectedDate) return;

    const fetchShows = async () => {
      try {
        setShowsLoading(true);
        const res = await showsApi.getShows({ movieId: movie._id, date: selectedDate });
        if (res.success) {
          setShows(res.data);
        }
      } catch (err) {
        console.error('Failed to load shows:', err);
      } finally {
        setShowsLoading(false);
      }
    };

    fetchShows();
  }, [movie?._id, selectedDate]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '400px', borderRadius: '24px', marginBottom: '30px' }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Movie Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The requested movie could not be located.</p>
        <Link to="/movies" className="btn-primary">Browse All Movies</Link>
      </div>
    );
  }

  // Group shows by Theatre
  const showsByTheatre = {};
  shows.forEach((show) => {
    const theatreId = show.theatre?._id || 'unknown';
    if (!showsByTheatre[theatreId]) {
      showsByTheatre[theatreId] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    showsByTheatre[theatreId].shows.push(show);
  });

  const handleSelectShowtime = (show) => {
    setSelectedShow(show);
    navigate(`/booking/seats/${show._id}`);
  };

  return (
    <div>
      {/* Backdrop Header Section */}
      <div style={{
        position: 'relative',
        minHeight: '480px',
        backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #07090e 5%, rgba(7, 9, 14, 0.8) 50%, rgba(7, 9, 14, 0.4) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '40px 20px' }}>
          <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            
            {/* Poster Card */}
            <div style={{
              width: '220px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%23161c2b"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%238b5cf6" font-family="sans-serif" font-size="32">🎬</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14" font-weight="bold">IMOVIES</text></svg>';
                }}
                style={{ width: '100%', display: 'block', aspectRatio: '2/3', objectFit: 'cover' }}
              />
            </div>

            {/* Title & Metadata Info */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge-tag badge-cert">{movie.certification}</span>
                <span className="badge-tag badge-genre">{movie.language}</span>
                {movie.status === 'NOW_SHOWING' ? (
                  <span className="badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    Now Showing
                  </span>
                ) : (
                  <span className="badge-tag" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    Coming Soon
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '14px' }}>
                {movie.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <span className="badge-tag badge-rating" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <Star size={16} fill="#fcd34d" color="#fcd34d" /> {movie.rating?.toFixed(1)} / 10 ({movie.votesCount?.toLocaleString()} votes)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <Clock size={16} /> {movie.duration} mins
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <Calendar size={16} /> Released {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a href="#showtimes-section" className="btn-primary" style={{ padding: '12px 28px' }}>
                  <Ticket size={18} /> Select Showtimes & Seats
                </a>
                {movie.trailerUrl && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="btn-secondary"
                    style={{ padding: '12px 22px' }}
                  >
                    <Play size={18} fill="#ffffff" /> Watch Trailer
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Body Details */}
      <div className="container" style={{ padding: '50px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }} className="details-layout">
          
          {/* Left Column: Synopsis & Cast */}
          <div>
            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}>About The Movie</h2>
              <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1rem' }}>
                {movie.description}
              </p>
            </section>

            {/* Cast & Crew */}
            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>Cast & Crew</h2>
              
              {movie.director && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Director</div>
                  <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>{movie.director}</div>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>Top Cast</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {movie.cast.map((actor, idx) => (
                      <span key={idx} style={{
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        color: '#e2e8f0',
                      }}>
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Quick Info Box */}
          <div>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                Movie Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Genres: </span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{movie.genres?.join(', ')}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Language: </span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{movie.language}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Runtime: </span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{movie.duration} minutes</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Age Rating: </span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{movie.certification}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Status: </span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{movie.status === 'NOW_SHOWING' ? 'In Theatres' : 'Coming Soon'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Showtimes & Booking Section */}
        <section id="showtimes-section" style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>Select Showtime & Cinema</h2>
            <p style={{ color: '#94a3b8' }}>Choose your preferred date, theatre complex, and showtime to pick your seats</p>
          </div>

          {/* Date Selector Tabs */}
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '32px',
          }}>
            {availableDates.map((item) => (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: selectedDate === item.date ? 'linear-gradient(135deg, #e50914, #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid',
                  borderColor: selectedDate === item.date ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                  color: selectedDate === item.date ? '#ffffff' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '110px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.date}</span>
              </button>
            ))}
          </div>

          {/* Shows Grouped by Theatre */}
          {showsLoading ? (
            <ShowListSkeleton />
          ) : Object.keys(showsByTheatre).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.values(showsByTheatre).map(({ theatre, shows: theatreShows }) => (
                <div key={theatre._id} className="glass-panel" style={{ padding: '24px' }}>
                  
                  {/* Theatre Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>{theatre.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <MapPin size={14} color="#8b5cf6" /> {theatre.address}, {theatre.city}
                      </div>
                    </div>

                    {/* Amenities pills */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {theatre.amenities?.slice(0, 3).map((a, i) => (
                        <span key={i} className="badge-tag badge-cert" style={{ fontSize: '0.7rem' }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes grid */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                    {theatreShows.map((show) => (
                      <button
                        key={show._id}
                        onClick={() => handleSelectShowtime(show)}
                        style={{
                          padding: '12px 18px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          minWidth: '120px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        className="showtime-btn"
                      >
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                          {show.startTime}
                        </span>
                        <span className="badge-tag badge-screen" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {show.screenType || 'Standard'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                          {show.availableSeats} seats left
                        </span>
                      </button>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
              <Film size={40} color="#64748b" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Showtimes Available</h3>
              <p style={{ color: '#94a3b8' }}>
                There are currently no scheduled screenings for {selectedDate}. Please select another date.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        trailerUrl={movie.trailerUrl}
        alternativeTrailerUrl={movie.alternativeTrailerUrl}
        title={movie.title}
        onClose={() => setTrailerOpen(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .details-layout { grid-template-columns: 1fr !important; }
        }
        .showtime-btn:hover {
          border-color: var(--accent-violet) !important;
          background: rgba(139, 92, 246, 0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default MovieDetails;
