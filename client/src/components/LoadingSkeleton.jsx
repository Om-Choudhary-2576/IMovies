import React from 'react';

export const MovieCardSkeleton = () => (
  <div style={{
    background: 'rgba(17, 22, 33, 0.7)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  }}>
    <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3' }} />
    <div style={{ padding: '16px' }}>
      <div className="skeleton" style={{ height: '20px', width: '75%', marginBottom: '10px' }} />
      <div className="skeleton" style={{ height: '14px', width: '45%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '38px', width: '100%', borderRadius: '8px' }} />
    </div>
  </div>
);

export const MovieGridSkeleton = ({ count = 8 }) => (
  <div className="movies-grid">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);

export const ShowListSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="glass-panel" style={{ padding: '24px' }}>
        <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '16px' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="skeleton" style={{ height: '40px', width: '90px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '40px', width: '90px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '40px', width: '90px', borderRadius: '8px' }} />
        </div>
      </div>
    ))}
  </div>
);
