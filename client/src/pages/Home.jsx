import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Ticket,
  Star,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Film,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { moviesApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/LoadingSkeleton';
import TrailerModal from '../components/TrailerModal';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: '', title: '' });

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Crime', 'Biography'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, nowRes, soonRes] = await Promise.all([
          moviesApi.getFeatured(),
          moviesApi.getNowShowing(),
          moviesApi.getComingSoon(),
        ]);

        if (featRes.success) setFeaturedMovies(featRes.data);
        if (nowRes.success) setNowShowing(nowRes.data);
        if (soonRes.success) setComingSoon(soonRes.data);
      } catch (err) {
        console.error('Failed to load movies for home page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentHero = featuredMovies[activeHeroIdx] || null;

  const heroPricing = currentHero?.ticketPrice || {
    standard: 12.0,
    premium: 16.0,
    vip: 22.0,
  };

  const filteredNowShowing = selectedGenre === 'All'
    ? nowShowing
    : nowShowing.filter((m) => m.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()));

  return (
    <div>
      {/* 1. Cinematic Hero Banner Section */}
      {currentHero ? (
        <section style={{
          position: 'relative',
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${currentHero.backdropUrl || currentHero.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          overflow: 'hidden',
        }}>
          {/* Gradients to blend into background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #07090e 15%, rgba(7, 9, 14, 0.85) 50%, rgba(7, 9, 14, 0.4) 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to top, #07090e 0%, transparent 100%)',
          }} />

          {/* Hero Content */}
          <div className="container" style={{ position: 'relative', zIndex: 10, padding: '80px 20px' }}>
            <div style={{ maxWidth: '680px' }}>
              
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }} className="badge-tag badge-genre">
                <Sparkles size={12} color="#c4b5fd" /> FEATURED PREMIERE
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '16px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}>
                {currentHero.title}
              </h1>

              {/* Metadata */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="badge-tag badge-rating">
                  <Star size={14} fill="#fcd34d" color="#fcd34d" /> {currentHero.rating?.toFixed(1)} / 10
                </span>
                <span className="badge-tag badge-cert">{currentHero.certification || 'PG-13'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <Clock size={15} /> {currentHero.duration} mins
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{currentHero.language}</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{currentHero.genres?.join(', ')}</span>
              </div>

              {/* Synopsis */}
              <p style={{
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: '#cbd5e1',
                marginBottom: '24px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              }}>
                {currentHero.description}
              </p>

              {/* Hero Ticket Pricing Info Bar */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: 'rgba(14, 18, 27, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: '12px',
                padding: '10px 18px',
                marginBottom: '28px',
                flexWrap: 'wrap',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: '#34d399',
                }}>
                  <Ticket size={16} color="#34d399" />
                  Ticket Prices: From ${heroPricing.standard.toFixed(2)}
                </div>
                <div style={{ height: '18px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.84rem' }}>
                  <span style={{ color: '#94a3b8' }}>
                    Standard: <strong style={{ color: '#ffffff' }}>${heroPricing.standard.toFixed(0)}</strong>
                  </span>
                  <span style={{ color: '#94a3b8' }}>
                    Premium: <strong style={{ color: '#c4b5fd' }}>${heroPricing.premium.toFixed(0)}</strong>
                  </span>
                  <span style={{ color: '#94a3b8' }}>
                    VIP: <strong style={{ color: '#fcd34d' }}>${heroPricing.vip.toFixed(0)}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to={`/movies/${currentHero.slug || currentHero._id}`} className="btn-primary" style={{ padding: '14px 30px', fontSize: '1rem' }}>
                  <Ticket size={20} /> Book Tickets &bull; From ${heroPricing.standard.toFixed(0)}
                </Link>
                {currentHero.trailerUrl && (
                  <button
                    onClick={() => setTrailerModal({ isOpen: true, url: currentHero.trailerUrl, title: currentHero.title })}
                    className="btn-secondary"
                    style={{ padding: '14px 26px', fontSize: '1rem' }}
                  >
                    <Play size={18} fill="#ffffff" /> Watch Trailer
                  </button>
                )}
              </div>

              {/* Hero Carousel Navigation Thumbnails */}
              {featuredMovies.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
                  {featuredMovies.map((feat, idx) => (
                    <button
                      key={feat._id}
                      onClick={() => setActiveHeroIdx(idx)}
                      style={{
                        height: '4px',
                        width: activeHeroIdx === idx ? '36px' : '14px',
                        borderRadius: '2px',
                        background: activeHeroIdx === idx ? '#e50914' : 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
      ) : null}

      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* 2. Genre Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '30px',
          scrollbarWidth: 'none',
        }}>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: selectedGenre === g ? 'linear-gradient(135deg, #e50914, #8b5cf6)' : 'rgba(255, 255, 255, 0.06)',
                color: selectedGenre === g ? '#ffffff' : '#94a3b8',
                border: '1px solid',
                borderColor: selectedGenre === g ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* 3. Now Showing Section */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>Now Showing In Theatres</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>Catch the latest blockbuster releases on big screens near you &bull; Live ticket prices shown for all tiers</p>
            </div>
            <Link to="/movies?status=NOW_SHOWING" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6', fontWeight: 600, fontSize: '0.92rem' }}>
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <MovieGridSkeleton count={8} />
          ) : filteredNowShowing.length > 0 ? (
            <div className="movies-grid">
              {filteredNowShowing.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              No movies found for the selected genre. Try another filter.
            </div>
          )}
        </section>

        {/* 4. Coming Soon / Advance Booking Section */}
        {comingSoon.length > 0 && (
          <section style={{ marginBottom: '70px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>Coming Soon</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>Anticipated blockbusters arriving soon &bull; Advance booking ticket prices</p>
              </div>
              <Link to="/movies?status=COMING_SOON" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6', fontWeight: 600, fontSize: '0.92rem' }}>
                Explore All <ChevronRight size={18} />
              </Link>
            </div>

            <div className="movies-grid">
              {comingSoon.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Why Book With IMovies Section */}
        <section className="glass-panel" style={{ padding: '50px 30px', margin: '60px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Why Book With IMovies?</h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px', fontSize: '0.95rem' }}>
            The smoothest movie ticketing platform with real-time seat locks and verified cinema experiences.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px',
            textAlign: 'left',
          }}>
            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(229, 9, 20, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Zap size={22} color="#e50914" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Instant Real-Time Holds</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Reserve your favorite seats with an atomic 8-minute guarantee. Never worry about double bookings.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Film size={22} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>IMAX & 4DX Ready</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Explore specialized formats including IMAX with Laser, Dolby Atmos 3D sound, and 4DX motion seats.
              </p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Instant QR Tickets</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Direct mobile admission with scannable QR boarding passes. No physical ticket counter queues needed.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        trailerUrl={trailerModal.url}
        title={trailerModal.title}
        onClose={() => setTrailerModal({ isOpen: false, url: '', title: '' })}
      />
    </div>
  );
};

export default Home;
