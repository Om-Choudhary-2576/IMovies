import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Film } from 'lucide-react';
import { moviesApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/LoadingSkeleton';

const BrowseMovies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Form states initialized from URL parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [language, setLanguage] = useState(searchParams.get('language') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');

  const genresList = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Crime', 'Thriller', 'Animation', 'Biography'];
  const languagesList = ['All', 'Hindi', 'Telugu', 'Kannada', 'English', 'Spanish'];

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        genre: genre !== 'All' ? genre : undefined,
        language: language !== 'All' ? language : undefined,
        status: status !== 'All' ? status : undefined,
        sortBy,
        page: searchParams.get('page') || 1,
        limit: 12,
      };

      const res = await moviesApi.getMovies(params);
      if (res.success) {
        setMovies(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (search.trim()) newParams.set('search', search.trim());
    if (genre !== 'All') newParams.set('genre', genre);
    if (language !== 'All') newParams.set('language', language);
    if (status !== 'All') newParams.set('status', status);
    if (sortBy !== 'rating') newParams.set('sortBy', sortBy);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>Explore Movies</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Browse our curated catalog of cinema releases, IMAX screenings, and upcoming premieres
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
        <form onSubmit={handleApplyFilters} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end',
        }}>
          {/* Search Box */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="search-input">Search Title / Cast</label>
            <div style={{ position: 'relative' }}>
              <input
                id="search-input"
                type="text"
                className="form-control"
                placeholder="e.g. Dune, Nolan, Batman..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Genre */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="genre-select">Genre</label>
            <select
              id="genre-select"
              className="form-control"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genresList.map((g) => (
                <option key={g} value={g} style={{ background: '#0e121a' }}>{g}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="status-select">Category</label>
            <select
              id="status-select"
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All" style={{ background: '#0e121a' }}>All Movies</option>
              <option value="NOW_SHOWING" style={{ background: '#0e121a' }}>Now Showing</option>
              <option value="COMING_SOON" style={{ background: '#0e121a' }}>Coming Soon</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="sort-select">Sort By</label>
            <select
              id="sort-select"
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating" style={{ background: '#0e121a' }}>Highest Rated</option>
              <option value="releaseDate" style={{ background: '#0e121a' }}>Release Date</option>
              <option value="title" style={{ background: '#0e121a' }}>Title (A-Z)</option>
              <option value="duration" style={{ background: '#0e121a' }}>Duration</option>
            </select>
          </div>

          {/* Submit Action */}
          <div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Filter size={16} /> Filter Results
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Found <strong style={{ color: '#ffffff' }}>{pagination.total}</strong> movies matching your criteria
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <MovieGridSkeleton count={8} />
      ) : movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Film size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Movies Found</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            We couldn't find any movies matching your current filters. Try resetting the search terms.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setGenre('All');
              setStatus('All');
              setSortBy('rating');
              setSearchParams(new URLSearchParams());
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '50px' }}>
          <button
            className="btn-secondary"
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            style={{ padding: '8px 16px', opacity: pagination.page <= 1 ? 0.4 : 1 }}
          >
            Previous
          </button>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '0 12px' }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="btn-secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            style={{ padding: '8px 16px', opacity: pagination.page >= pagination.totalPages ? 0.4 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseMovies;
