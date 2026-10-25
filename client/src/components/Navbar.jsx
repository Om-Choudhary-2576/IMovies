import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  User,
  Ticket,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Clapperboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(7, 9, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 0',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #e50914 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(229, 9, 20, 0.4)',
          }}>
            <Film size={22} color="#ffffff" />
          </div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #ffffff 40%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            IMOVIES
          </span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          padding: '6px 14px',
          width: '100%',
          maxWidth: '320px',
          transition: 'all 0.2s ease',
        }}>
          <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search movies, genres, cast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.88rem',
              width: '100%',
            }}
          />
        </form>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <Link to="/" style={{
            fontWeight: 600,
            fontSize: '0.92rem',
            color: isActive('/') ? '#e50914' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            Home
          </Link>
          <Link to="/movies" style={{
            fontWeight: 600,
            fontSize: '0.92rem',
            color: isActive('/movies') ? '#e50914' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            Browse Movies
          </Link>
          <Link to="/theatres" style={{
            fontWeight: 600,
            fontSize: '0.92rem',
            color: isActive('/theatres') ? '#e50914' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            Theatres
          </Link>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #e50914)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={14} color="#ffffff" />
                </div>
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '220px',
                  background: '#111621',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  padding: '8px',
                  zIndex: 100,
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                    }}
                  >
                    <User size={16} /> Profile
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                    }}
                  >
                    <Ticket size={16} /> My Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        color: '#c084fc',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                      }}
                    >
                      <ShieldAlert size={16} /> Admin Console
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" style={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '8px 16px',
              }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', color: '#ffffff' }}
          className="mobile-toggle"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '20px',
          background: '#0d111a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontWeight: 600 }}>Home</Link>
          <Link to="/movies" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontWeight: 600 }}>Browse Movies</Link>
          <Link to="/theatres" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontWeight: 600 }}>Theatres</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1' }}>Profile</Link>
              <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1' }}>My Bookings</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#c084fc' }}>Admin Dashboard</Link>}
              <button onClick={handleLogout} style={{ color: '#ef4444', textAlign: 'left', fontWeight: 600 }}>Sign Out</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary" style={{ flex: 1 }}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
