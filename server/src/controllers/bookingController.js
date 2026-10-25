import QRCode from 'qrcode';
import crypto from 'crypto';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';

const CONVENIENCE_FEE_PER_TICKET = 1.5;
const TAX_RATE = 0.08; // 8% sales tax

/**
 * Helper to generate random readable booking reference like IM-4829-1092
 */
const generateBookingReference = () => {
  const p1 = Math.floor(1000 + Math.random() * 9000);
  const p2 = Math.floor(1000 + Math.random() * 9000);
  return `IM-${p1}-${p2}`;
};

/**
 * @route   POST /api/bookings/hold
 * @desc    Atomically place an 8-minute temporary hold on selected seats
 * @access  Private
 */
export const holdSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers } = req.body;

    if (!showId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and an array of seat numbers to hold',
      });
    }

    if (seatNumbers.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 seats can be selected per booking',
      });
    }

    const show = await Show.findById(showId);
    if (!show || show.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: 'Show not found or no longer active',
      });
    }

    const now = new Date();
    const unavailableSeats = [];
    const heldSeatsData = [];

    // Check availability of each requested seat
    for (const seatNum of seatNumbers) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);

      if (!seat) {
        unavailableSeats.push({ seatNumber: seatNum, reason: 'Seat does not exist' });
        continue;
      }

      if (seat.status === 'BOOKED') {
        unavailableSeats.push({ seatNumber: seatNum, reason: 'Seat is already booked' });
        continue;
      }

      // Check if held by another user and hold has not expired
      if (
        seat.status === 'HELD' &&
        seat.holdExpiresAt &&
        seat.holdExpiresAt > now &&
        seat.heldBy &&
        seat.heldBy.toString() !== req.user._id.toString()
      ) {
        unavailableSeats.push({ seatNumber: seatNum, reason: 'Seat is temporarily reserved by another user' });
        continue;
      }

      heldSeatsData.push(seat);
    }

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Some of the selected seats are currently unavailable',
        unavailableSeats,
      });
    }

    // Place 8-minute hold on all requested seats atomically
    const holdExpiresAt = new Date(Date.now() + 8 * 60 * 1000);

    for (const seat of heldSeatsData) {
      seat.status = 'HELD';
      seat.heldBy = req.user._id;
      seat.holdExpiresAt = holdExpiresAt;
    }

    await show.save();

    // Calculate preliminary breakdown
    const subtotal = heldSeatsData.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = heldSeatsData.length * CONVENIENCE_FEE_PER_TICKET;
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const totalAmount = parseFloat((subtotal + convenienceFee + tax).toFixed(2));

    res.status(200).json({
      success: true,
      message: 'Seats held successfully for 8 minutes',
      data: {
        showId: show._id,
        seats: heldSeatsData.map((s) => ({
          seatNumber: s.seatNumber,
          row: s.row,
          column: s.column,
          tier: s.tier,
          price: s.price,
        })),
        pricing: {
          subtotal,
          convenienceFee,
          tax,
          totalAmount,
        },
        holdExpiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/confirm
 * @desc    Confirm booking, calculate verified price, process payment, generate ticket & QR code
 * @access  Private
 */
export const confirmBooking = async (req, res, next) => {
  try {
    const { showId, seatNumbers, paymentMethod = 'Card', promoCode } = req.body;

    if (!showId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and seatNumbers for booking confirmation',
      });
    }

    const show = await Show.findById(showId).populate('movie').populate('theatre');
    if (!show || show.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: 'Show not found or inactive',
      });
    }

    const now = new Date();
    const confirmedSeats = [];

    // Revalidate seat eligibility
    for (const seatNum of seatNumbers) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);

      if (!seat) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is invalid`,
        });
      }

      if (seat.status === 'BOOKED') {
        return res.status(409).json({
          success: false,
          message: `Seat ${seatNum} has already been booked by another customer`,
        });
      }

      // If held by someone else, verify hold validity
      if (
        seat.status === 'HELD' &&
        seat.holdExpiresAt &&
        seat.holdExpiresAt > now &&
        seat.heldBy &&
        seat.heldBy.toString() !== req.user._id.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: `Seat ${seatNum} is reserved by another customer`,
        });
      }

      confirmedSeats.push(seat);
    }

    // Backend price calculation (Never trust client-submitted prices)
    const subtotal = confirmedSeats.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = confirmedSeats.length * CONVENIENCE_FEE_PER_TICKET;
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));

    // Promo code validation
    let discount = 0;
    if (promoCode) {
      const code = promoCode.toUpperCase().trim();
      if (code === 'IMOVIE20') {
        discount = parseFloat((subtotal * 0.2).toFixed(2)); // 20% discount on subtotal
      } else if (code === 'FIRST10') {
        discount = Math.min(10, subtotal);
      }
    }

    const totalAmount = Math.max(0, parseFloat((subtotal + convenienceFee + tax - discount).toFixed(2)));

    // Mark seats as BOOKED in the Show document atomically
    for (const seat of confirmedSeats) {
      seat.status = 'BOOKED';
      seat.heldBy = req.user._id;
      seat.holdExpiresAt = null;
    }
    await show.save();

    // Generate unique booking reference
    let bookingReference = generateBookingReference();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Booking.findOne({ bookingReference });
      if (!existing) {
        isUnique = true;
      } else {
        bookingReference = generateBookingReference();
      }
    }

    // Generate QR code ticket data
    const qrDataPayload = JSON.stringify({
      ref: bookingReference,
      showId: show._id,
      movie: show.movie.title,
      date: show.date,
      time: show.startTime,
      seats: confirmedSeats.map((s) => s.seatNumber),
      authHash: crypto.createHash('sha256').update(`${bookingReference}:${req.user._id}`).digest('hex').substring(0, 16),
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrDataPayload, {
      errorCorrectionLevel: 'M',
      color: { dark: '#0a0d14', light: '#ffffff' },
      margin: 2,
    });

    // Create Booking record
    const booking = await Booking.create({
      bookingReference,
      user: req.user._id,
      show: show._id,
      movie: {
        id: show.movie._id,
        title: show.movie.title,
        posterUrl: show.movie.posterUrl,
        duration: show.movie.duration,
        language: show.movie.language,
      },
      theatre: {
        id: show.theatre._id,
        name: show.theatre.name,
        city: show.theatre.city,
        screenName: show.screenName,
        screenType: show.screenType,
      },
      showDetails: {
        date: show.date,
        startTime: show.startTime,
        endTime: show.endTime,
      },
      seats: confirmedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        row: s.row,
        column: s.column,
        tier: s.tier,
        price: s.price,
      })),
      subtotal,
      convenienceFee,
      tax,
      discount,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'SUCCESS',
      paymentMethod,
      qrCode: qrCodeDataUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Get logged-in user's bookings
 * @access  Private
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/:idOrReference
 * @desc    Get booking details by ID or reference
 * @access  Private
 */
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let booking = null;

    if (id.startsWith('IM-')) {
      booking = await Booking.findOne({ bookingReference: id });
    } else {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership or admin privileges
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel booking and release seats back to available pool
 * @access  Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    // Release seats in the Show document back to AVAILABLE
    const show = await Show.findById(booking.show);
    if (show) {
      const bookedSeatNumbers = booking.seats.map((s) => s.seatNumber);
      for (const seat of show.seats) {
        if (bookedSeatNumbers.includes(seat.seatNumber)) {
          seat.status = 'AVAILABLE';
          seat.heldBy = null;
          seat.holdExpiresAt = null;
        }
      }
      await show.save();
    }

    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'User initiated cancellation';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and seats released',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
