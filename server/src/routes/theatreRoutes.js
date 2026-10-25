import express from 'express';
import {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} from '../controllers/theatreController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTheatres);
router.get('/:id', getTheatreById);

// Admin-only endpoints
router.post('/', protect, isAdmin, createTheatre);
router.put('/:id', protect, isAdmin, updateTheatre);
router.delete('/:id', protect, isAdmin, deleteTheatre);

export default router;
