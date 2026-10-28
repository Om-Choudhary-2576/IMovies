import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Film, Clock, ChevronRight } from 'lucide-react';
import { showsApi } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { ShowListSkeleton } from '../components/LoadingSkeleton';

const ShowtimeSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSelectedShow } = useBooking();

  const movieIdParam = searchParams.get('movieId');
  const theatreIdParam = searchParams.get('theatreId');

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  // Generate 5 dates
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

  useEffect(() => {
    if (!selectedDate) return;

    const fetchShows = async () => {
      try {
        setLoading(true);
        const params = {
          date: selectedDate,
          movieId: movieIdParam || undefined,
          theatreId: theatreIdParam || undefined,
        };

        const res = await showsApi.getShows(params);
        if (res.success) {
          setShows(res.data);
        }
      } catch (err) {
        console.error('Failed to load shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [selectedDate, movieIdParam, theatreIdParam]);

  // Group shows by Movie
  const showsByMovie = {};
  shows.forEach((show) => {
    const movieId = show.movie?._id || 'unknown';
    if (!showsByMovie[movieId]) {
      showsByMovie[movieId] = {
        movie: show.movie,
        theatres: {},
      };
    }
    const theatreId = show.theatre?._id || 'unknown';
    if (!showsByMovie[movieId].theatres[theatreId]) {
      showsByMovie[movieId].theatres[theatreId] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    showsByMovie[movieId].theatres[theatreId].shows.push(show);
  });

  const handleSelectShowtime = (show) => {
    setSelectedShow(show);
    navigate(`/booking/seats/${show._id}`);
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>Cinema Schedules & Showtimes</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Select your date and time to reserve seats with guaranteed availability
        </p>
      </div>

      {/* Date Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '36px',
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

      {/* Shows List */}
      {loading ? (
        <ShowListSkeleton />
      ) : Object.keys(showsByMovie).length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.values(showsByMovie).map(({ movie, theatres }) => (
            <div key={movie._id} className="glass-panel" style={{ padding: '28px' }}>
              
              {/* Movie Header */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px' }}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90"><rect width="60" height="90" fill="%23161c2b"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%238b5cf6" font-family="sans-serif" font-size="18">🎬</text></svg>';
                  }}
                  style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <Link to={`/movies/${movie.slug || movie._id}`}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>{movie.title}</h2>
                  </Link>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span className="badge-tag badge-cert">{movie.certification}</span>
                    <span>{movie.language}</span>
                    <span>&bull;</span>
                    <span>{movie.duration} mins</span>
                  </div>
                </div>
              </div>

              {/* Theatres offering this movie */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.values(theatres).map(({ theatre, shows: showtimes }) => (
                  <div key={theatre._id} style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                        {theatre.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {theatre.city} &bull; {theatre.address}
                      </div>
                    </div>

                    {/* Showtimes Grid */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {showtimes.map((show) => (
                        <button
                          key={show._id}
                          onClick={() => handleSelectShowtime(show)}
                          style={{
                            padding: '10px 16px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            minWidth: '110px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                            {show.startTime}
                          </span>
                          <span className="badge-tag badge-screen" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                            {show.screenType || 'Standard'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                            {show.availableSeats} seats
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Film size={40} color="#64748b" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Showtimes Scheduled</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            There are no shows matching your parameters for {selectedDate}. Try selecting another date or movie.
          </p>
          <Link to="/movies" className="btn-primary">Browse All Movies</Link>
        </div>
      )}
    </div>
  );
};

export default ShowtimeSelection;
