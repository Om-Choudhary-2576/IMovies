import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Ticket,
  Printer,
  Calendar,
  Clock,
  MapPin,
  Film,
  Download,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { bookingsApi } from '../services/api';

const BookingConfirmation = () => {
  const { id } = useParams(); // Can be booking ID or Reference code
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e50914', '#8b5cf6', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      // Ignore if unsupported
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await bookingsApi.getBookingById(id);
        if (res.success && res.data) {
          setBooking(res.data);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Unable to retrieve booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '500px', maxWidth: '680px', margin: '0 auto', borderRadius: '24px' }} />
      </div>
    );
  }

  if (errorMsg || !booking) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={40} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Booking Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{errorMsg || 'We could not find this booking record.'}</p>
          <Link to="/my-bookings" className="btn-primary">View My Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '780px' }}>
      
      {/* Celebration Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }} className="no-print">
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)',
        }}>
          <CheckCircle size={36} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Your tickets have been issued. Present this digital pass at the cinema entrance.
        </p>
      </div>

      {/* Cinematic Boarding Pass Ticket */}
      <div
        className="glass-panel print-ticket"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          background: 'linear-gradient(145deg, #101522 0%, #0c0f18 100%)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          marginBottom: '32px',
        }}
      >
        {/* Ticket Top Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, #e50914 0%, #8b5cf6 100%)',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, letterSpacing: '0.05em' }}>
            <Ticket size={20} /> IMOVIES DIGITAL PASS
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '9999px' }}>
            CONFIRMED
          </div>
        </div>

        {/* Ticket Main Content */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '24px', alignItems: 'center', marginBottom: '28px' }} className="ticket-header-grid">
            
            {/* Poster */}
            {booking.movie?.posterUrl && (
              <img
                src={booking.movie.posterUrl}
                alt={booking.movie.title}
                style={{ width: '120px', height: '170px', objectFit: 'cover', borderRadius: '12px' }}
              />
            )}

            {/* Movie & Show Info */}
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>
                {booking.movie?.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#8b5cf6" />
                  <strong>{booking.theatre?.name}</strong> &bull; {booking.theatre?.screenName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} color="#8b5cf6" />
                  {booking.showDetails?.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={15} color="#8b5cf6" />
                  <strong>{booking.showDetails?.startTime}</strong> ({booking.theatre?.screenType || 'Standard'})
                </div>
              </div>
            </div>

            {/* QR Code */}
            {booking.qrCode && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  padding: '8px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  display: 'inline-block',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                }}>
                  <img src={booking.qrCode} alt="Ticket QR Verification" style={{ width: '100px', height: '100px', display: 'block' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', letterSpacing: '0.05em' }}>
                  SCAN AT GATE
                </div>
              </div>
            )}
          </div>

          {/* Perforated Divider line */}
          <div style={{
            borderTop: '2px dashed rgba(255, 255, 255, 0.15)',
            margin: '24px -32px',
            position: 'relative',
          }}>
            {/* Cutout notches */}
            <div style={{ position: 'absolute', left: '-12px', top: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#07090e' }} />
            <div style={{ position: 'absolute', right: '-12px', top: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#07090e' }} />
          </div>

          {/* Ticket Bottom Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '20px',
            paddingTop: '8px',
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Booking Ref</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e50914', letterSpacing: '0.04em' }}>
                {booking.bookingReference}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Seats Reserved</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                {booking.seats?.map((s) => s.seatNumber).join(', ')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Paid</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                ${booking.totalAmount?.toFixed(2)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Payment Method</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                {booking.paymentMethod || 'Credit Card'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} className="no-print">
        <button onClick={handlePrint} className="btn-secondary" style={{ padding: '12px 24px' }}>
          <Printer size={18} /> Print or Save Ticket
        </button>
        <Link to="/my-bookings" className="btn-primary" style={{ padding: '12px 24px' }}>
          <Ticket size={18} /> View in My Bookings
        </Link>
        <Link to="/movies" className="btn-secondary" style={{ padding: '12px 24px' }}>
          Book Another Movie
        </Link>
      </div>

      <style>{`
        @media print {
          .no-print, nav, footer { display: none !important; }
          body, html { background: #ffffff !important; color: #000000 !important; }
          .print-ticket {
            box-shadow: none !important;
            border: 2px solid #000000 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
        @media (max-width: 640px) {
          .ticket-header-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .ticket-header-grid img { margin: 0 auto; }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
