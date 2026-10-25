import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ trailerUrl, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  // Extract YouTube embed URL if standard URL provided
  let embedUrl = trailerUrl;
  if (trailerUrl && trailerUrl.includes('watch?v=')) {
    embedUrl = trailerUrl.replace('watch?v=', 'embed/');
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        background: '#0d111a',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{title} — Official Trailer</h3>
          <button onClick={onClose} style={{ color: '#94a3b8', padding: '4px' }} aria-label="Close trailer">
            <X size={22} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={`${title} Trailer`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
