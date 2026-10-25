import express from 'express';
import {
  getStats,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce both authentication and admin role on all admin routes
router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

export default router;
