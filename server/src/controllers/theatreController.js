import Theatre from '../models/Theatre.js';

/**
 * @route   GET /api/theatres
 * @desc    Get all theatres with optional city filter
 * @access  Public
 */
export const getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city && city.trim() !== '' && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/theatres/:id
 * @desc    Get single theatre details
 * @access  Public
 */
export const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.status(200).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/theatres
 * @desc    Create a new theatre with screens
 * @access  Private/Admin
 */
export const createTheatre = async (req, res, next) => {
  try {
    const { name, city, address, amenities, screens } = req.body;

    const formattedScreens = Array.isArray(screens) && screens.length > 0
      ? screens
      : [
          {
            screenNumber: 1,
            name: 'Screen 1 - Standard',
            screenType: 'Standard',
            totalRows: 8,
            seatsPerRow: 12,
            totalSeats: 96,
          },
          {
            screenNumber: 2,
            name: 'Screen 2 - IMAX',
            screenType: 'IMAX',
            totalRows: 8,
            seatsPerRow: 12,
            totalSeats: 96,
          },
        ];

    const theatre = await Theatre.create({
      name,
      city,
      address,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map((a) => a.trim()) : undefined),
      screens: formattedScreens,
    });

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/theatres/:id
 * @desc    Update theatre details
 * @access  Private/Admin
 */
export const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    const updated = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/theatres/:id
 * @desc    Delete theatre
 * @access  Private/Admin
 */
export const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    await Theatre.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
