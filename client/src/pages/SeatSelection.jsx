import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  ChevronRight,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { showsApi } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    setSelectedMovie,
    setSelectedTheatre,
    setSelectedShow,
    selectedSeats,
    toggleSeat,
    holdSelectedSeats,
  } = useBooking();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const res = await showsApi.getShowById(showId);
        if (res.success && res.data) {
          setShow(res.data);
          setSelectedShow(res.data);
          if (res.data.movie) setSelectedMovie(res.data.movie);
          if (res.data.theatre) setSelectedTheatre(res.data.theatre);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load seating map for this show');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();

    // Polling refresh every 15 seconds for live availability updates
    const interval = setInterval(fetchShow, 15000);
    return () => clearInterval(interval);
  }, [showId]);

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least 1 seat before proceeding.');
      return;
    }

    if (!isAuthenticated) {
      // Store redirect target
      navigate(`/login?redirect=/booking/seats/${showId}`);
      return;
    }

    try {
      setHolding(true);
      setErrorMsg('');
      const seatNumbers = selectedSeats.map((s) => s.seatNumber);
      await holdSelectedSeats(showId, seatNumbers);
      navigate(`/booking/summary/${showId}`);
    } catch (err) {
      setErrorMsg(err.message || 'Could not reserve seats. Someone may have just selected them.');
      // Refresh show seats immediately
      const refreshed = await showsApi.getShowById(showId);
      if (refreshed.success) setShow(refreshed.data);
    } finally {
      setHolding(false);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '60px', width: '50%', margin: '0 auto 30px' }} />
        <div className="skeleton" style={{ height: '400px', borderRadius: '20px' }} />
      </div>
    );
  }

  if (errorMsg && !show) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={40} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Unable to Load Show</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{errorMsg}</p>
          <Link to="/movies" className="btn-primary">Browse Other Shows</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 20px 80px' }}>
      
      {/* Show Information Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>{show.movie?.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', color: '#94a3b8', fontSize: '0.88rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#8b5cf6" /> {show.theatre?.name} ({show.screenName})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="#8b5cf6" /> {show.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#ffffff' }}>
              <Clock size={15} color="#e50914" /> {show.startTime}
            </span>
            <span className="badge-tag badge-screen">{show.screenType}</span>
          </div>
        </div>

        {/* Change Showtime CTA */}
        <Link to={`/movies/${show.movie?.slug || show.movie?._id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Change Time
        </Link>
      </div>

      {/* Error Alert Banner if any conflict */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '24px',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Seat Map Panel */}
      <div className="glass-panel" style={{ padding: '30px 20px' }}>
        <SeatMap
          seats={show.seats || []}
          selectedSeats={selectedSeats}
          onSeatToggle={toggleSeat}
          currentUserId={user?._id}
        />
      </div>

      {/* Bottom Sticky Floating Booking Bar */}
      <div style={{
        position: 'sticky',
        bottom: '20px',
        zIndex: 50,
        marginTop: '30px',
      }}>
        <div className="glass-panel" style={{
          padding: '18px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(139, 92, 246, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          background: 'rgba(14, 18, 27, 0.95)',
        }}>
          
          {/* Selected Seats info */}
          <div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px' }}>
              Selected Seats ({selectedSeats.length} / 8 max):
            </div>
            {selectedSeats.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedSeats.map((seat) => (
                  <span key={seat.seatNumber} className="badge-tag" style={{ background: '#e50914', color: '#ffffff', fontWeight: 700 }}>
                    {seat.seatNumber} (${seat.price.toFixed(2)})
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Click on the seats above to choose your spot
              </div>
            )}
          </div>

          {/* Pricing & Proceed Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Subtotal</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                ${totalPrice.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0 || holding}
              className="btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '0.95rem',
                opacity: selectedSeats.length === 0 || holding ? 0.5 : 1,
                cursor: selectedSeats.length === 0 || holding ? 'not-allowed' : 'pointer',
              }}
            >
              <Ticket size={18} />
              {holding ? 'Reserving Seats...' : 'Proceed to Checkout'}
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SeatSelection;
