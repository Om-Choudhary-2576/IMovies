import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Ticket,
  Film,
  Building,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  PlusCircle,
  ChevronRight,
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '6px' }}>
            Administrator Dashboard
          </h1>
          <p style={{ color: '#94a3b8' }}>Real-time cinema performance metrics, scheduling, and ticket sales</p>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/movies" className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
            <PlusCircle size={16} /> Manage Movies
          </Link>
          <Link to="/admin/shows" className="btn-violet" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
            <Calendar size={16} /> Schedule Shows
          </Link>
        </div>
      </div>

      {/* Admin Subnav */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '36px',
        overflowX: 'auto',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px',
      }}>
        <Link to="/admin" style={{ padding: '8px 16px', borderRadius: '8px', background: '#8b5cf6', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
          Overview
        </Link>
        <Link to="/admin/movies" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
          Movies Catalog
        </Link>
        <Link to="/admin/theatres" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
          Theatres & Screens
        </Link>
        <Link to="/admin/shows" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
          Show Schedules
        </Link>
        <Link to="/admin/bookings" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
          All Bookings
        </Link>
      </div>

      {/* KPI Stats Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {/* Total Revenue */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            ${stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '6px' }}>
            &bull; Verified confirmed sales
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Bookings</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={20} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {stats?.confirmedBookings || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
            {stats?.cancelledBookings || 0} cancelled
          </div>
        </div>

        {/* Movies in Catalog */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Movies</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(229, 9, 20, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={20} color="#e50914" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {stats?.totalMovies || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
            Active releases
          </div>
        </div>

        {/* Theatres & Shows */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Cinemas & Shows</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={20} color="#38bdf8" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {stats?.totalTheatres || 0} / {stats?.totalShows || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
            Cinemas & active screenings
          </div>
        </div>
      </div>

      {/* Recent Bookings Audit Table */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Recent Customer Bookings</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Latest ticket reservations across all cinema screens</p>
          </div>
          <Link to="/admin/bookings" style={{ color: '#8b5cf6', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Full Log <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 14px' }}>Reference</th>
                <th style={{ padding: '12px 14px' }}>Movie</th>
                <th style={{ padding: '12px 14px' }}>Customer</th>
                <th style={{ padding: '12px 14px' }}>Seats</th>
                <th style={{ padding: '12px 14px' }}>Amount</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                    <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 700, color: '#e50914' }}>
                      {b.bookingReference}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#ffffff' }}>
                      {b.movie?.title}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div>{b.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      {b.seats?.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#ffffff' }}>
                      ${b.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge-tag" style={{
                        background: b.bookingStatus === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: b.bookingStatus === 'CONFIRMED' ? '#34d399' : '#f87171',
                      }}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    No bookings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
