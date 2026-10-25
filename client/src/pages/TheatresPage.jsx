import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Film, Sparkles, Tv, CheckCircle2, ChevronRight } from 'lucide-react';
import { theatresApi } from '../services/api';

const TheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);

  const cities = ['All', 'New York', 'Los Angeles', 'Chicago'];

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        setLoading(true);
        const res = await theatresApi.getTheatres({
          city: selectedCity !== 'All' ? selectedCity : undefined,
        });
        if (res.success) {
          setTheatres(res.data);
        }
      } catch (err) {
        console.error('Failed to load theatres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, [selectedCity]);

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>Cinema Theatres</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Discover state-of-the-art auditoriums featuring IMAX Laser, Dolby Atmos sound, and premium recliner seating
        </p>
      </div>

      {/* City Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '36px', overflowX: 'auto', paddingBottom: '8px' }}>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: selectedCity === city ? 'linear-gradient(135deg, #e50914, #8b5cf6)' : 'rgba(255, 255, 255, 0.06)',
              color: selectedCity === city ? '#ffffff' : '#94a3b8',
              border: '1px solid',
              borderColor: selectedCity === city ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Theatres List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-panel" style={{ padding: '30px', height: '180px' }}>
              <div className="skeleton" style={{ height: '24px', width: '35%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '16px', width: '55%', marginBottom: '20px' }} />
              <div className="skeleton" style={{ height: '36px', width: '25%', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
      ) : theatres.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="glass-panel theatre-card"
              style={{
                padding: '30px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{theatre.name}</h2>
                  <span className="badge-tag badge-genre">{theatre.city}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.92rem', marginBottom: '18px' }}>
                  <MapPin size={16} color="#e50914" /> {theatre.address}
                </div>

                {/* Screens */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Screens & Formats
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {theatre.screens?.map((screen) => (
                      <span key={screen._id} className="badge-tag badge-screen">
                        {screen.name} ({screen.screenType})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Amenities
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {theatre.amenities?.map((amenity, idx) => (
                      <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <CheckCircle2 size={13} color="#34d399" /> {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Link to={`/shows?theatreId=${theatre._id}`} className="btn-primary" style={{ padding: '12px 24px', width: '100%', maxWidth: '240px' }}>
                  View All Showtimes <ChevronRight size={18} />
                </Link>
                <Link to="/movies" className="btn-secondary" style={{ padding: '10px 20px', width: '100%', maxWidth: '240px' }}>
                  Browse Movies
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Film size={40} color="#64748b" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Theatres Found</h3>
          <p style={{ color: '#94a3b8' }}>No cinema locations matching the selected city.</p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .theatre-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default TheatresPage;
