import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, Filter, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { adminApi } from '../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getAllBookings({
        page,
        status: status !== 'All' ? status : undefined,
        search: search.trim() || undefined,
        limit: 15,
      });

      if (res.success) {
        setBookings(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Update this booking status to ${newStatus}?`)) return;
    try {
      await adminApi.updateBookingStatus(id, { bookingStatus: newStatus });
      await fetchBookings(pagination.page);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>All Customer Bookings</h1>
        <p style={{ color: '#94a3b8' }}>Comprehensive audit log of all tickets reserved, confirmed, or cancelled</p>
      </div>

      {/* Admin Subnav */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px',
        overflowX: 'auto',
      }}>
        <Link to="/admin" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Overview</Link>
        <Link to="/admin/movies" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Movies Catalog</Link>
        <Link to="/admin/theatres" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Theatres & Screens</Link>
        <Link to="/admin/shows" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Show Schedules</Link>
        <Link to="/admin/bookings" style={{ padding: '8px 16px', borderRadius: '8px', background: '#8b5cf6', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>All Bookings</Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '30px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Reference code (e.g. IM-...) or Movie title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Reference</th>
              <th style={{ padding: '12px 14px' }}>Customer</th>
              <th style={{ padding: '12px 14px' }}>Movie</th>
              <th style={{ padding: '12px 14px' }}>Cinema & Date</th>
              <th style={{ padding: '12px 14px' }}>Seats</th>
              <th style={{ padding: '12px 14px' }}>Total</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 800, color: '#e50914' }}>
                  <Link to={`/booking/ticket/${b.bookingReference}`} style={{ color: 'inherit' }}>
                    {b.bookingReference}
                  </Link>
                </td>
                <td style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{b.user?.name || 'Customer'}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.user?.email}</div>
                </td>
                <td style={{ padding: '14px', fontWeight: 600, color: '#ffffff' }}>
                  {b.movie?.title}
                </td>
                <td style={{ padding: '14px', fontSize: '0.85rem' }}>
                  <div>{b.theatre?.name}</div>
                  <div style={{ color: '#94a3b8' }}>{b.showDetails?.date} &bull; {b.showDetails?.startTime}</div>
                </td>
                <td style={{ padding: '14px' }}>
                  {b.seats?.map((s) => s.seatNumber).join(', ')}
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#ffffff' }}>
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
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  {b.bookingStatus === 'CONFIRMED' ? (
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'CANCELLED')}
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'CONFIRMED')}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Reconfirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            <button
              className="btn-secondary"
              disabled={pagination.page <= 1}
              onClick={() => fetchBookings(pagination.page - 1)}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Previous
            </button>
            <span style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#94a3b8' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="btn-secondary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchBookings(pagination.page + 1)}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminBookings;
