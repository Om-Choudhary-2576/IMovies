import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { bookingsApi } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsApi.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The seats will be released.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setErrorMsg('');
      setSuccessMsg('');
      const res = await bookingsApi.cancelBooking(bookingId, 'Customer requested cancellation');
      setSuccessMsg('Booking successfully cancelled and seats released.');
      await fetchBookings();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = statusFilter === 'All'
    ? bookings
    : bookings.filter((b) => b.bookingStatus === statusFilter);

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>My Movie Tickets</h1>
        <p style={{ color: '#94a3b8' }}>View and manage your active cinema bookings and digital QR boarding passes</p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          color: '#34d399',
        }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          color: '#f87171',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        {['All', 'CONFIRMED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: statusFilter === st ? 'linear-gradient(135deg, #e50914, #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
              color: statusFilter === st ? '#ffffff' : '#94a3b8',
              border: '1px solid',
              borderColor: statusFilter === st ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s',
            }}
          >
            {st === 'All' ? 'All Bookings' : st.charAt(0) + st.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-panel" style={{ padding: '24px', height: '140px' }}>
              <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '14px' }} />
              <div className="skeleton" style={{ height: '16px', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="glass-panel booking-card"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              {/* Poster Thumbnail */}
              {b.movie?.posterUrl ? (
                <img
                  src={b.movie.posterUrl}
                  alt={b.movie.title}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="130" viewBox="0 0 90 130"><rect width="90" height="130" fill="%23161c2b"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%238b5cf6" font-family="sans-serif" font-size="24">🎬</text></svg>';
                  }}
                  style={{ width: '90px', height: '130px', objectFit: 'cover', borderRadius: '10px' }}
                />
              ) : (
                <div style={{ width: '90px', height: '130px', background: '#1c2436', borderRadius: '10px' }} />
              )}

              {/* Booking Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    {b.movie?.title}
                  </span>
                  <span
                    className="badge-tag"
                    style={{
                      background: b.bookingStatus === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: b.bookingStatus === 'CONFIRMED' ? '#34d399' : '#f87171',
                      border: '1px solid currentColor',
                    }}
                  >
                    {b.bookingStatus}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    #{b.bookingReference}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#8b5cf6" />
                    <strong>{b.theatre?.name}</strong> &bull; {b.theatre?.screenName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8b5cf6" />
                    {b.showDetails?.date} &bull; <Clock size={14} color="#8b5cf6" /> {b.showDetails?.startTime}
                  </div>
                </div>

                {/* Seats tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Seats:</span>
                  {b.seats?.map((s) => (
                    <span key={s.seatNumber} className="badge-tag" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}>
                      {s.seatNumber}
                    </span>
                  ))}
                  <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginLeft: '12px' }}>
                    Total: ${b.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Link
                  to={`/booking/ticket/${b.bookingReference}`}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                >
                  <QrCode size={16} /> View Digital Pass
                </Link>

                {b.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(b._id)}
                    disabled={cancellingId === b._id}
                    className="btn-danger"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                  >
                    <XCircle size={14} />
                    {cancellingId === b._id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Ticket size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Bookings Found</h3>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
            You haven't booked any movies yet. Check out the latest releases now showing!
          </p>
          <Link to="/movies" className="btn-primary">Discover Movies</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .booking-card { grid-template-columns: 1fr !important; text-align: left; }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
