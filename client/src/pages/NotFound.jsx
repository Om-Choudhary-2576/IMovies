import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container" style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: 'rgba(229, 9, 20, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 0 30px rgba(229, 9, 20, 0.3)',
      }}>
        <Film size={40} color="#e50914" />
      </div>

      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1, marginBottom: '12px', color: '#ffffff' }}>
        404
      </h1>

      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
        Scene Missing / Page Not Found
      </h2>

      <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto 32px', fontSize: '1rem', lineHeight: 1.6 }}>
        The reel you are looking for seems to have been cut from the final screening. Let's get you back to the feature presentation.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary" style={{ padding: '12px 28px' }}>
          <Home size={18} /> Return Home
        </Link>
        <Link to="/movies" className="btn-secondary" style={{ padding: '12px 28px' }}>
          <Compass size={18} /> Browse Movies
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
