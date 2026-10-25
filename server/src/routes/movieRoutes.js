import express from 'express';
import {
  getMovies,
  getFeaturedMovies,
  getNowShowing,
  getComingSoon,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/featured', getFeaturedMovies);
router.get('/now-showing', getNowShowing);
router.get('/coming-soon', getComingSoon);
router.get('/:id', getMovieById);

// Admin-only endpoints
router.post('/', protect, isAdmin, createMovie);
router.put('/:id', protect, isAdmin, updateMovie);
router.delete('/:id', protect, isAdmin, deleteMovie);

export default router;
