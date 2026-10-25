import React, { useState } from 'react';
import { Armchair, Check, AlertCircle } from 'lucide-react';

const SeatMap = ({
  seats = [],
  selectedSeats = [],
  onSeatToggle,
  maxSeats = 8,
  currentUserId,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Group seats by row
  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });

  // Sort rows alphabetically (A, B, C...)
  const sortedRowKeys = Object.keys(rows).sort();

  const getSeatStatus = (seat) => {
    // Is selected in current booking state?
    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
    if (isSelected) return 'SELECTED';

    // Already booked in database?
    if (seat.status === 'BOOKED') return 'BOOKED';

    // Currently held by someone else and hold hasn't expired?
    if (seat.status === 'HELD' && seat.holdExpiresAt && new Date(seat.holdExpiresAt) > new Date()) {
      if (seat.heldBy && seat.heldBy.toString() === currentUserId?.toString()) {
        return 'MY_HOLD';
      }
      return 'HELD';
    }

    return 'AVAILABLE';
  };

  const getSeatStyle = (seat, status) => {
    const baseStyle = {
      width: '34px',
      height: '34px',
      borderRadius: '8px 8px 4px 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 700,
      transition: 'all 0.18s ease',
      position: 'relative',
    };

    if (status === 'SELECTED') {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #e50914, #ff334b)',
        color: '#ffffff',
        boxShadow: '0 0 12px rgba(229, 9, 20, 0.6)',
        border: '1px solid #ff4d61',
        cursor: 'pointer',
        transform: 'scale(1.08)',
      };
    }

    if (status === 'BOOKED') {
      return {
        ...baseStyle,
        background: 'rgba(30, 36, 50, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#475569',
        cursor: 'not-allowed',
        opacity: 0.5,
      };
    }

    if (status === 'HELD') {
      return {
        ...baseStyle,
        background: 'rgba(245, 158, 11, 0.2)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        color: '#fbbf24',
        cursor: 'not-allowed',
      };
    }

    // AVAILABLE tiers
    if (seat.tier === 'vip') {
      return {
        ...baseStyle,
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        color: '#fcd34d',
        cursor: 'pointer',
      };
    }

    if (seat.tier === 'premium') {
      return {
        ...baseStyle,
        background: 'rgba(139, 92, 246, 0.12)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        color: '#c4b5fd',
        cursor: 'pointer',
      };
    }

    // Standard
    return {
      ...baseStyle,
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      color: '#e2e8f0',
      cursor: 'pointer',
    };
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '20px 0' }}>
      
      {/* Cinema Screen Curve */}
      <div style={{ maxWidth: '640px', margin: '0 auto 40px', textAlign: 'center' }}>
        <div style={{
          height: '10px',
          background: 'linear-gradient(90deg, transparent, #8b5cf6 30%, #e50914 70%, transparent)',
          borderRadius: '50% / 100% 100% 0 0',
          boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)',
          marginBottom: '12px',
        }} />
        <span style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          fontWeight: 600,
        }}>
          Cinema Screen Ahead
        </span>
      </div>

      {/* Seat Rows Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {sortedRowKeys.map((rowKey) => {
          const rowSeats = rows[rowKey].sort((a, b) => a.column - b.column);
          const firstSeat = rowSeats[0];
          const tierLabel = firstSeat?.tier?.toUpperCase();

          return (
            <div key={rowKey} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Row letter */}
              <span style={{
                width: '24px',
                textAlign: 'center',
                fontWeight: 700,
                color: '#64748b',
                fontSize: '0.85rem',
              }}>
                {rowKey}
              </span>

              {/* Seats in this row */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {rowSeats.map((seat, index) => {
                  const status = getSeatStatus(seat);
                  const isSelectable = status === 'AVAILABLE' || status === 'SELECTED' || status === 'MY_HOLD';

                  return (
                    <React.Fragment key={seat.seatNumber}>
                      {/* Walkway gap in the middle */}
                      {index === Math.floor(rowSeats.length / 2) && (
                        <div style={{ width: '24px' }} />
                      )}

                      <button
                        type="button"
                        style={getSeatStyle(seat, status)}
                        disabled={!isSelectable}
                        onClick={() => isSelectable && onSeatToggle(seat)}
                        onMouseEnter={() => setHoveredSeat(seat)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        aria-label={`Seat ${seat.seatNumber}, ${seat.tier} tier, $${seat.price}`}
                      >
                        {status === 'SELECTED' ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          seat.column
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row tier label */}
              <span style={{
                width: '60px',
                fontSize: '0.7rem',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                {tierLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Seat Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginTop: '40px',
        padding: '16px',
        background: 'rgba(14, 18, 27, 0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }} />
          Standard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.4)' }} />
          Premium
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)' }} />
          VIP Recliner
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#e50914', border: '1px solid #ff4d61' }} />
          Selected
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(30, 36, 50, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }} />
          Booked / Sold
        </div>
      </div>

      {/* Hovered Seat Details floating bar */}
      {hoveredSeat && (
        <div style={{
          textAlign: 'center',
          marginTop: '12px',
          fontSize: '0.85rem',
          color: '#cbd5e1',
          fontWeight: 600,
        }}>
          Seat {hoveredSeat.seatNumber} &bull; {hoveredSeat.tier.toUpperCase()} Tier &bull; ${hoveredSeat.price.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default SeatMap;
