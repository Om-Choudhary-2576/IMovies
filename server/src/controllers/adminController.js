import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard metrics, revenue, and counts
 * @access  Private/Admin
 */
export const getStats = async (req, res, next) => {
  try {
    const [
      totalMovies,
      totalTheatres,
      totalShows,
      totalUsers,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      Movie.countDocuments(),
      Theatre.countDocuments(),
      Show.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'CONFIRMED' }),
      Booking.countDocuments({ bookingStatus: 'CANCELLED' }),
      Booking.aggregate([
        { $match: { bookingStatus: 'CONFIRMED' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Booking.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        totalTheatres,
        totalShows,
        totalUsers,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/bookings
 * @desc    Get paginated bookings with search and status filters
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { bookingReference: { $regex: search.trim(), $options: 'i' } },
        { 'movie.title': { $regex: search.trim(), $options: 'i' } },
        { 'theatre.name': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
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
 * @route   PUT /api/admin/bookings/:id/status
 * @desc    Update booking and payment status
 * @access  Private/Admin
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
