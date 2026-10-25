import Show from '../models/Show.js';
import Theatre from '../models/Theatre.js';
import Movie from '../models/Movie.js';

/**
 * @route   GET /api/shows
 * @desc    Get shows with filtering by movie, theatre, date, city
 * @access  Public
 */
export const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date, city } = req.query;
    const query = { status: 'ACTIVE' };

    if (movieId) query.movie = movieId;
    if (theatreId) query.theatre = theatreId;
    if (date) query.date = date;

    // Filter by city requires matching theatres in that city
    if (city && city.trim() !== '' && city !== 'All') {
      const theatresInCity = await Theatre.find({
        city: { $regex: new RegExp(`^${city.trim()}$`, 'i') },
      }).select('_id');
      const theatreIds = theatresInCity.map((t) => t._id);
      query.theatre = { $in: theatreIds };
    }

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration language certification rating slug')
      .populate('theatre', 'name city address amenities')
      .sort({ date: 1, startTime: 1 })
      .lean();

    // Map summary metrics (available seats count) without sending full seat array
    const formattedShows = shows.map((show) => {
      const now = new Date();
      const totalSeats = show.seats ? show.seats.length : 0;
      const availableSeats = show.seats
        ? show.seats.filter(
            (s) => s.status === 'AVAILABLE' || (s.status === 'HELD' && s.holdExpiresAt && new Date(s.holdExpiresAt) < now)
          ).length
        : 0;

      const { seats, ...rest } = show;
      return {
        ...rest,
        totalSeats,
        availableSeats,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedShows.length,
      data: formattedShows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/shows/:id
 * @desc    Get single show details including full real-time seat matrix
 * @access  Public
 */
export const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Lazily clean up expired seat holds
    const now = new Date();
    let modified = false;

    for (const seat of show.seats) {
      if (seat.status === 'HELD' && seat.holdExpiresAt && seat.holdExpiresAt < now) {
        seat.status = 'AVAILABLE';
        seat.heldBy = null;
        seat.holdExpiresAt = null;
        modified = true;
      }
    }

    if (modified) {
      await show.save();
    }

    res.status(200).json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/shows
 * @desc    Schedule a new show (validates screen schedule conflict)
 * @access  Private/Admin
 */
export const createShow = async (req, res, next) => {
  try {
    const {
      movieId,
      theatreId,
      screenId,
      date,
      startTime,
      endTime,
      tierPricing,
    } = req.body;

    // Validate movie and theatre existence
    const [movie, theatre] = await Promise.all([
      Movie.findById(movieId),
      Theatre.findById(theatreId),
    ]);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Referenced movie not found' });
    }
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Referenced theatre not found' });
    }

    const screen = theatre.screens.id(screenId);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Referenced screen not found in theatre' });
    }

    // Check for conflicting show schedule on the same screen at the same date and time
    const conflict = await Show.findOne({
      theatre: theatreId,
      screenId: screen._id,
      date,
      startTime,
      status: 'ACTIVE',
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict: Screen "${screen.name}" already has an active show scheduled at ${startTime} on ${date}`,
      });
    }

    // Calculate approximate endTime based on movie duration if not provided
    let calculatedEndTime = endTime;
    if (!calculatedEndTime && startTime && movie.duration) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const totalStartMinutes = startHour * 60 + startMin;
      const totalEndMinutes = totalStartMinutes + movie.duration + 20; // 20 min interval/cleanup
      const endHour = Math.floor(totalEndMinutes / 60) % 24;
      const endMinutes = totalEndMinutes % 60;
      calculatedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }

    // Generate seats
    const pricing = tierPricing || { standard: 12.0, premium: 16.0, vip: 22.0 };
    const generatedSeats = Show.generateSeats(screen.totalRows || 8, screen.seatsPerRow || 12, pricing);

    const show = await Show.create({
      movie: movieId,
      theatre: theatreId,
      screenId: screen._id,
      screenName: screen.name,
      screenType: screen.screenType,
      date,
      startTime,
      endTime: calculatedEndTime || '',
      tierPricing: pricing,
      seats: generatedSeats,
      status: 'ACTIVE',
    });

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/shows/:id
 * @desc    Update show details or status
 * @access  Private/Admin
 */
export const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const { status, tierPricing } = req.body;
    if (status) show.status = status;
    if (tierPricing) show.tierPricing = tierPricing;

    await show.save();

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/shows/:id
 * @desc    Cancel or delete show
 * @access  Private/Admin
 */
export const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    await Show.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
