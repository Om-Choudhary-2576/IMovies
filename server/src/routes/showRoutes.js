import express from 'express';
import {
  getShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
} from '../controllers/showController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getShows);
router.get('/:id', getShowById);

// Admin-only endpoints
router.post('/', protect, isAdmin, createShow);
router.put('/:id', protect, isAdmin, updateShow);
router.delete('/:id', protect, isAdmin, deleteShow);

export default router;
