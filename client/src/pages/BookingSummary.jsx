import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Timer,
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const BookingSummary = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedShow,
    selectedSeats,
    holdExpiresAt,
    confirmCurrentBooking,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes default (seconds)
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate hold countdown
  useEffect(() => {
    if (!holdExpiresAt) return;

    const updateTimer = () => {
      const remainingMs = new Date(holdExpiresAt).getTime() - Date.now();
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(remainingSec);

      if (remainingSec <= 0) {
        setErrorMsg('Your 8-minute seat reservation has expired. Please select seats again.');
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [holdExpiresAt]);

  // Pricing calculations
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = selectedSeats.length * 1.5;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = Math.max(0, parseFloat((subtotal + convenienceFee + tax - discountAmount).toFixed(2)));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.toUpperCase().trim();

    if (code === 'IMOVIE20') {
      const discount = parseFloat((subtotal * 0.2).toFixed(2));
      setDiscountAmount(discount);
      setAppliedPromo('IMOVIE20 (20% OFF)');
    } else if (code === 'FIRST10') {
      const discount = Math.min(10, subtotal);
      setDiscountAmount(discount);
      setAppliedPromo('FIRST10 ($10 OFF)');
    } else {
      setPromoError('Invalid promo code. Try "IMOVIE20" or "FIRST10".');
    }
  };

  const handleConfirm = async () => {
    if (timeLeft <= 0) {
      setErrorMsg('Seat hold expired. Please return to seat selection.');
      return;
    }

    try {
      setProcessing(true);
      setErrorMsg('');
      const confirmedBooking = await confirmCurrentBooking(paymentMethod, appliedPromo ? promoInput.trim() : '');
      navigate(`/booking/ticket/${confirmedBooking.bookingReference}`);
    } catch (err) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!selectedShow || selectedSeats.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>No Active Booking Session</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Please choose a movie and select seats first.</p>
        <Link to="/movies" className="btn-primary">Browse Movies</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '1000px' }}>
      
      {/* Back button */}
      <Link to={`/booking/seats/${showId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ChevronLeft size={16} /> Back to Seat Selection
      </Link>

      {/* Countdown Timer Alert Bar */}
      <div style={{
        background: timeLeft < 120 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.15)',
        border: `1px solid ${timeLeft < 120 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(139, 92, 246, 0.3)'}`,
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Timer size={20} color={timeLeft < 120 ? '#ef4444' : '#c084fc'} />
          <span style={{ fontSize: '0.92rem', color: '#ffffff' }}>
            {timeLeft > 0 ? 'Your seats are held. Complete booking before timer runs out:' : 'Reservation expired'}
          </span>
        </div>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          fontFamily: 'monospace',
          color: timeLeft < 120 ? '#ef4444' : '#c084fc',
        }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
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

      {/* Two Column Layout: Details & Payment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }} className="summary-layout">
        
        {/* Left: Booking Recap & Payment Method */}
        <div>
          {/* Movie & Show Recap */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              Booking Summary
            </h2>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {selectedShow.movie?.posterUrl && (
                <img
                  src={selectedShow.movie.posterUrl}
                  alt={selectedShow.movie.title}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120"><rect width="80" height="120" fill="%23161c2b"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%238b5cf6" font-family="sans-serif" font-size="24">🎬</text></svg>';
                  }}
                  style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                />
              )}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                  {selectedShow.movie?.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#94a3b8', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#8b5cf6" />
                    {selectedShow.theatre?.name} &bull; {selectedShow.screenName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8b5cf6" />
                    {selectedShow.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#8b5cf6" />
                    {selectedShow.startTime} ({selectedShow.screenType || 'Standard'})
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats tags */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>Reserved Seats:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedSeats.map((s) => (
                  <span key={s.seatNumber} className="badge-tag" style={{ background: '#e50914', color: '#ffffff', fontWeight: 700 }}>
                    {s.seatNumber} ({s.tier?.toUpperCase()} - ${s.price.toFixed(2)})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
              Select Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'Credit Card', label: 'Credit / Debit Card', desc: 'Instant checkout simulation' },
                { id: 'Digital Wallet', label: 'Apple Pay / Google Pay / PayPal', desc: 'Secure digital payment' },
                { id: 'MockDevPayment', label: 'Demo Instant Checkout (Safe Sandbox)', desc: 'Zero credentials required' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: paymentMethod === opt.id ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${paymentMethod === opt.id ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: '#34d399' }}>
              <ShieldCheck size={16} /> End-to-end 256-bit encrypted checkout
            </div>
          </div>
        </div>

        {/* Right: Price Breakdown & Confirmation */}
        <div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              Order Breakdown
            </h3>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Tickets ({selectedSeats.length})</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Convenience Fee ($1.50/seat)</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>${convenienceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Estimated Sales Tax (8%)</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>${tax.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Promo Discount ({appliedPromo})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Total Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                marginTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}>
                <span style={{ color: '#ffffff' }}>Total Amount</span>
                <span style={{ color: '#ffffff' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Have a discount code? (Try "IMOVIE20")
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="form-control"
                  style={{ textTransform: 'uppercase', padding: '10px 14px', fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.88rem' }}>
                  Apply
                </button>
              </div>
              {promoError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{promoError}</div>
              )}
              {appliedPromo && (
                <div style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '6px' }}>
                  &check; Coupon applied: {appliedPromo}
                </div>
              )}
            </form>

            {/* Confirm & Pay Button */}
            <button
              onClick={handleConfirm}
              disabled={processing || timeLeft <= 0}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '28px',
                padding: '16px',
                fontSize: '1.05rem',
                opacity: processing || timeLeft <= 0 ? 0.6 : 1,
              }}
            >
              <CreditCard size={20} />
              {processing ? 'Confirming Ticket...' : `Pay $${total.toFixed(2)} & Get Ticket`}
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .summary-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default BookingSummary;
