import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  PlusCircle,
  Edit2,
  Trash2,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { moviesApi } from '../services/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    genres: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    releaseDate: '2026-10-30',
    cast: '',
    director: '',
    certification: 'PG-13',
    rating: 8.5,
    trailerUrl: '',
    status: 'NOW_SHOWING',
    isFeatured: false,
  });

  const [feedback, setFeedback] = useState({ error: '', success: '' });

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await moviesApi.getMovies({ limit: 50 });
      if (res.success) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
      genres: 'Action, Adventure',
      language: 'English',
      duration: 135,
      releaseDate: new Date().toISOString().split('T')[0],
      cast: 'Actor One, Actor Two',
      director: 'Director Name',
      certification: 'PG-13',
      rating: 8.0,
      trailerUrl: '',
      status: 'NOW_SHOWING',
      isFeatured: false,
    });
    setModalOpen(true);
    setFeedback({ error: '', success: '' });
  };

  const openEditModal = (movie) => {
    setIsEditing(true);
    setEditingId(movie._id);
    setFormData({
      title: movie.title,
      description: movie.description,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      genres: movie.genres?.join(', ') || '',
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      cast: movie.cast?.join(', ') || '',
      director: movie.director || '',
      certification: movie.certification,
      rating: movie.rating,
      trailerUrl: movie.trailerUrl || '',
      status: movie.status,
      isFeatured: movie.isFeatured,
    });
    setModalOpen(true);
    setFeedback({ error: '', success: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setFeedback({ error: '', success: '' });
      if (isEditing) {
        await moviesApi.updateMovie(editingId, formData);
        setFeedback({ success: 'Movie updated successfully!', error: '' });
      } else {
        await moviesApi.createMovie(formData);
        setFeedback({ success: 'Movie created successfully!', error: '' });
      }
      setModalOpen(false);
      await fetchMovies();
    } catch (err) {
      setFeedback({ error: err.message || 'Error saving movie', success: '' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await moviesApi.deleteMovie(id);
      await fetchMovies();
    } catch (err) {
      alert(err.message || 'Failed to delete movie');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>Manage Movie Catalog</h1>
          <p style={{ color: '#94a3b8' }}>Create, update, or remove movies and adjust publication status</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <PlusCircle size={18} /> Add New Movie
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
        <Link to="/admin" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
          Overview
        </Link>
        <Link to="/admin/movies" style={{ padding: '8px 16px', borderRadius: '8px', background: '#8b5cf6', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
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

      {/* Movies Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Poster</th>
              <th style={{ padding: '12px 14px' }}>Title</th>
              <th style={{ padding: '12px 14px' }}>Genres</th>
              <th style={{ padding: '12px 14px' }}>Duration</th>
              <th style={{ padding: '12px 14px' }}>Rating</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                <td style={{ padding: '12px 14px' }}>
                  <img src={m.posterUrl} alt={m.title} style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '6px' }} />
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>
                  {m.title}
                  {m.isFeatured && (
                    <span className="badge-tag" style={{ marginLeft: '8px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.65rem' }}>
                      FEATURED
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 14px' }}>{m.genres?.join(', ')}</td>
                <td style={{ padding: '12px 14px' }}>{m.duration}m</td>
                <td style={{ padding: '12px 14px' }}>
                  <span className="badge-tag badge-rating">
                    <Star size={12} fill="#fcd34d" color="#fcd34d" /> {m.rating}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span className="badge-tag" style={{
                    background: m.status === 'NOW_SHOWING' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: m.status === 'NOW_SHOWING' ? '#34d399' : '#fbbf24',
                  }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(m)}
                      style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', color: '#cbd5e1' }}
                      title="Edit Movie"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', color: '#ef4444' }}
                      title="Delete Movie"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
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
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', color: '#94a3b8' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
              {isEditing ? 'Edit Movie Details' : 'Add New Movie to Catalog'}
            </h2>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Movie Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description / Synopsis *</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Poster Image URL *</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Backdrop Image URL *</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Genres (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="NOW_SHOWING">NOW_SHOWING</option>
                    <option value="COMING_SOON">COMING_SOON</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trailer Video URL (YouTube)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                    />
                    Feature this movie in the homepage hero banner
                  </label>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMovies;
