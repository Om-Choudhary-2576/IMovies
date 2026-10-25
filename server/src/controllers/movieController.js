import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/movies
 * @desc    Get all movies with search, filters, sorting, and pagination
 * @access  Public
 */
export const getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      language,
      status,
      sortBy = 'rating',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { cast: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Genre filter (case-insensitive match)
    if (genre && genre !== 'All') {
      query.genres = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
    }

    // Language filter
    if (language && language !== 'All') {
      query.language = { $regex: new RegExp(`^${language.trim()}$`, 'i') };
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status.toUpperCase();
    }

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    if (sortBy === 'releaseDate') {
      sortOptions.releaseDate = sortOrder;
    } else if (sortBy === 'duration') {
      sortOptions.duration = sortOrder;
    } else if (sortBy === 'title') {
      sortOptions.title = sortOrder;
    } else {
      sortOptions.rating = sortOrder;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [movies, total] = await Promise.all([
      Movie.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Movie.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/featured
 * @desc    Get featured movies for hero section
 * @access  Public
 */
export const getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ isFeatured: true, status: 'NOW_SHOWING' })
      .sort({ rating: -1 })
      .limit(5);

    // If none marked as featured, fallback to top rated now showing
    if (movies.length === 0) {
      const fallback = await Movie.find({ status: 'NOW_SHOWING' })
        .sort({ rating: -1 })
        .limit(5);
      return res.status(200).json({ success: true, data: fallback });
    }

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/now-showing
 * @desc    Get currently running movies
 * @access  Public
 */
export const getNowShowing = async (req, res, next) => {
  try {
    const movies = await Movie.find({ status: 'NOW_SHOWING' }).sort({ rating: -1 });
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/coming-soon
 * @desc    Get upcoming movies
 * @access  Public
 */
export const getComingSoon = async (req, res, next) => {
  try {
    const movies = await Movie.find({ status: 'COMING_SOON' }).sort({ releaseDate: 1 });
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/:idOrSlug
 * @desc    Get single movie by ID or slug
 * @access  Public
 */
export const getMovieById = async (req, res, next) => {
  try {
    const { id: param } = req.params;
    let movie = null;

    if (mongoose.Types.ObjectId.isValid(param)) {
      movie = await Movie.findById(param);
    }
    if (!movie) {
      movie = await Movie.findOne({ slug: param.toLowerCase() });
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/movies
 * @desc    Create a new movie
 * @access  Private/Admin
 */
export const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      posterUrl,
      backdropUrl,
      genres,
      language,
      duration,
      releaseDate,
      cast,
      director,
      certification,
      rating,
      trailerUrl,
      status,
      isFeatured,
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      posterUrl,
      backdropUrl,
      genres: Array.isArray(genres) ? genres : genres.split(',').map((g) => g.trim()),
      language: language || 'English',
      duration: Number(duration),
      releaseDate: new Date(releaseDate),
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map((c) => c.trim()) : []),
      director,
      certification: certification || 'PG-13',
      rating: rating ? Number(rating) : 8.0,
      trailerUrl,
      status: status || 'NOW_SHOWING',
      isFeatured: Boolean(isFeatured),
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/movies/:id
 * @desc    Update a movie
 * @access  Private/Admin
 */
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Process array fields if string
    const updates = { ...req.body };
    if (typeof updates.genres === 'string') {
      updates.genres = updates.genres.split(',').map((g) => g.trim());
    }
    if (typeof updates.cast === 'string') {
      updates.cast = updates.cast.split(',').map((c) => c.trim());
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/movies/:id
 * @desc    Delete a movie
 * @access  Private/Admin
 */
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
