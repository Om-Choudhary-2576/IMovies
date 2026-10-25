import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, PlusCircle, Trash2, X, MapPin, CheckCircle2 } from 'lucide-react';
import { theatresApi } from '../services/api';

const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: 'New York',
    address: '',
    amenities: 'Dolby Atmos, IMAX, Luxury Recliners, Food Court',
    screens: [
      { screenNumber: 1, name: 'Screen 1 - Standard', screenType: 'Standard', totalRows: 8, seatsPerRow: 12, totalSeats: 96 },
      { screenNumber: 2, name: 'Screen 2 - IMAX', screenType: 'IMAX', totalRows: 8, seatsPerRow: 12, totalSeats: 96 },
    ],
  });

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await theatresApi.getTheatres();
      if (res.success) {
        setTheatres(res.data);
      }
    } catch (err) {
      console.error('Failed to load theatres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await theatresApi.createTheatre(formData);
      setModalOpen(false);
      await fetchTheatres();
    } catch (err) {
      alert(err.message || 'Error creating theatre');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theatre complex?')) return;
    try {
      await theatresApi.deleteTheatre(id);
      await fetchTheatres();
    } catch (err) {
      alert(err.message || 'Failed to delete theatre');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>Manage Theatres & Screens</h1>
          <p style={{ color: '#94a3b8' }}>Configure physical cinema locations, auditoriums, and screening formats</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <PlusCircle size={18} /> Add New Theatre
        </button>
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
        <Link to="/admin/theatres" style={{ padding: '8px 16px', borderRadius: '8px', background: '#8b5cf6', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>Theatres & Screens</Link>
        <Link to="/admin/shows" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Show Schedules</Link>
        <Link to="/admin/bookings" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>All Bookings</Link>
      </div>

      {/* Theatres Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Cinema Name</th>
              <th style={{ padding: '12px 14px' }}>City</th>
              <th style={{ padding: '12px 14px' }}>Address</th>
              <th style={{ padding: '12px 14px' }}>Screens Configured</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                <td style={{ padding: '14px', fontWeight: 700, color: '#ffffff' }}>
                  {t.name}
                </td>
                <td style={{ padding: '14px' }}>
                  <span className="badge-tag badge-genre">{t.city}</span>
                </td>
                <td style={{ padding: '14px' }}>{t.address}</td>
                <td style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {t.screens?.map((s) => (
                      <span key={s._id} className="badge-tag badge-screen" style={{ fontSize: '0.72rem' }}>
                        {s.name} ({s.totalSeats} seats)
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(t._id)}
                    style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', color: '#ef4444' }}
                    title="Delete Theatre"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Theatre Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', color: '#94a3b8' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Add Cinema Complex</h2>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Theatre Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. IMovies Cinema City"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. San Francisco"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 100 Market St, Suite 400"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amenities (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Complex
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTheatres;
