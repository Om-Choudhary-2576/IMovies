import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PlusCircle, Trash2, X, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { showsApi, moviesApi, theatresApi } from '../services/api';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    tierPricing: {
      standard: 12.0,
      premium: 16.0,
      vip: 22.0,
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        showsApi.getShows({}),
        moviesApi.getMovies({ limit: 50, status: 'NOW_SHOWING' }),
        theatresApi.getTheatres({}),
      ]);

      if (showsRes.success) setShows(showsRes.data);
      if (moviesRes.success) setMovies(moviesRes.data);
      if (theatresRes.success) setTheatres(theatresRes.data);

      if (moviesRes.data?.length > 0 && theatresRes.data?.length > 0) {
        const firstTheatre = theatresRes.data[0];
        setFormData((prev) => ({
          ...prev,
          movieId: moviesRes.data[0]._id,
          theatreId: firstTheatre._id,
          screenId: firstTheatre.screens?.[0]?._id || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load admin shows data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTheatreChange = (e) => {
    const tId = e.target.value;
    const theatre = theatres.find((t) => t._id === tId);
    setFormData({
      ...formData,
      theatreId: tId,
      screenId: theatre?.screens?.[0]?._id || '',
    });
  };

  const handleScheduleShow = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const res = await showsApi.createShow(formData);
      setSuccessMsg('Show screening successfully scheduled!');
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setErrorMsg(err.message || 'Screen schedule conflict or error scheduling show');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this scheduled show?')) return;
    try {
      await showsApi.deleteShow(id);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to cancel show');
    }
  };

  const selectedTheatreObj = theatres.find((t) => t._id === formData.theatreId);

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>Manage Show Schedules</h1>
          <p style={{ color: '#94a3b8' }}>Schedule screenings across cinema auditoriums with conflict prevention</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <PlusCircle size={18} /> Schedule New Show
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
        <Link to="/admin/theatres" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Theatres & Screens</Link>
        <Link to="/admin/shows" style={{ padding: '8px 16px', borderRadius: '8px', background: '#8b5cf6', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>Show Schedules</Link>
        <Link to="/admin/bookings" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>All Bookings</Link>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', color: '#34d399' }}>
          {successMsg}
        </div>
      )}

      {/* Shows Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Movie</th>
              <th style={{ padding: '12px 14px' }}>Cinema & Screen</th>
              <th style={{ padding: '12px 14px' }}>Date</th>
              <th style={{ padding: '12px 14px' }}>Showtime</th>
              <th style={{ padding: '12px 14px' }}>Tier Pricing</th>
              <th style={{ padding: '12px 14px' }}>Available Seats</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((s) => (
              <tr key={s._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                <td style={{ padding: '14px', fontWeight: 700, color: '#ffffff' }}>
                  {s.movie?.title}
                </td>
                <td style={{ padding: '14px' }}>
                  <div>{s.theatre?.name}</div>
                  <span className="badge-tag badge-screen" style={{ fontSize: '0.7rem' }}>
                    {s.screenName} ({s.screenType})
                  </span>
                </td>
                <td style={{ padding: '14px' }}>{s.date}</td>
                <td style={{ padding: '14px', fontWeight: 700, color: '#ffffff' }}>
                  {s.startTime}
                </td>
                <td style={{ padding: '14px', fontSize: '0.8rem' }}>
                  Std: ${s.tierPricing?.standard} &bull; Prem: ${s.tierPricing?.premium} &bull; VIP: ${s.tierPricing?.vip}
                </td>
                <td style={{ padding: '14px', color: '#34d399', fontWeight: 600 }}>
                  {s.availableSeats} / {s.totalSeats} seats
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(s._id)}
                    style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', color: '#ef4444' }}
                    title="Cancel Show"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Show Modal */}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', color: '#94a3b8' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Schedule Movie Screening</h2>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleScheduleShow}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* Movie */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Select Movie</label>
                  <select
                    className="form-control"
                    value={formData.movieId}
                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                    required
                  >
                    {movies.map((m) => (
                      <option key={m._id} value={m._id} style={{ background: '#0e121a' }}>
                        {m.title} ({m.duration}m - {m.language})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theatre */}
                <div className="form-group">
                  <label className="form-label">Cinema Complex</label>
                  <select
                    className="form-control"
                    value={formData.theatreId}
                    onChange={handleTheatreChange}
                    required
                  >
                    {theatres.map((t) => (
                      <option key={t._id} value={t._id} style={{ background: '#0e121a' }}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Screen */}
                <div className="form-group">
                  <label className="form-label">Auditorium / Screen</label>
                  <select
                    className="form-control"
                    value={formData.screenId}
                    onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                    required
                  >
                    {selectedTheatreObj?.screens?.map((s) => (
                      <option key={s._id} value={s._id} style={{ background: '#0e121a' }}>
                        {s.name} ({s.screenType})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label">Show Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                {/* Start Time */}
                <div className="form-group">
                  <label className="form-label">Start Time (HH:mm)</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                {/* Pricing */}
                <div className="form-group">
                  <label className="form-label">Standard Seat Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={formData.tierPricing.standard}
                    onChange={(e) => setFormData({
                      ...formData,
                      tierPricing: { ...formData.tierPricing, standard: Number(e.target.value) },
                    })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">VIP Recliner Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={formData.tierPricing.vip}
                    onChange={(e) => setFormData({
                      ...formData,
                      tierPricing: { ...formData.tierPricing, vip: Number(e.target.value) },
                    })}
                  />
                </div>

              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Schedule Screening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminShows;
