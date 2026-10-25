import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#040609',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 0 30px',
      marginTop: '80px',
      color: '#94a3b8',
      fontSize: '0.9rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* Col 1: Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #e50914 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Film size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                IMOVIES
              </span>
            </Link>
            <p style={{ lineHeight: 1.6, color: '#64748b', marginBottom: '20px' }}>
              Movie Ticket Booking Made Simple. Discover world-class cinema experiences, secure your favorite seats in real-time, and enjoy effortless entertainment.
            </p>
            <div style={{ display: 'flex', gap: '8px', color: '#38bdf8', fontSize: '0.8rem', alignItems: 'center' }}>
              <Shield size={14} /> 256-Bit SSL Encrypted & Verified
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '18px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/movies" style={{ color: '#94a3b8' }}>Now Showing</Link></li>
              <li><Link to="/movies?status=COMING_SOON" style={{ color: '#94a3b8' }}>Coming Soon</Link></li>
              <li><Link to="/theatres" style={{ color: '#94a3b8' }}>Cinemas & Theatres</Link></li>
              <li><Link to="/my-bookings" style={{ color: '#94a3b8' }}>Ticket History</Link></li>
              <li><Link to="/admin/login" style={{ color: '#64748b' }}>Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Genres */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '18px' }}>Genres</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/movies?genre=Action" style={{ color: '#94a3b8' }}>Action & Adventure</Link></li>
              <li><Link to="/movies?genre=Sci-Fi" style={{ color: '#94a3b8' }}>Science Fiction & IMAX</Link></li>
              <li><Link to="/movies?genre=Drama" style={{ color: '#94a3b8' }}>Drama & Classics</Link></li>
              <li><Link to="/movies?genre=Animation" style={{ color: '#94a3b8' }}>Animation & Family</Link></li>
              <li><Link to="/movies?genre=Thriller" style={{ color: '#94a3b8' }}>Mystery & Thriller</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '18px' }}>Customer Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color="#8b5cf6" /> support@imovies.com</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} color="#8b5cf6" /> +1 (800) 555-4668</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color="#8b5cf6" /> Times Square, New York, NY</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#64748b',
        }}>
          <div>
            &copy; {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved. Built for cinema lovers.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
