import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'standard',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'HELD', 'BOOKED'],
    default: 'AVAILABLE',
  },
  heldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  holdExpiresAt: {
    type: Date,
    default: null,
  },
});

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Screen ID is required'],
    },
    screenName: {
      type: String,
      required: true,
    },
    screenType: {
      type: String,
      default: 'Standard',
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Show date (YYYY-MM-DD) is required'],
      index: true,
    },
    startTime: {
      type: String, // HH:mm (24-hour format)
      required: [true, 'Start time is required'],
      index: true,
    },
    endTime: {
      type: String,
      default: '',
    },
    tierPricing: {
      standard: { type: Number, default: 12.0 },
      premium: { type: Number, default: 16.0 },
      vip: { type: Number, default: 22.0 },
    },
    seats: [seatSchema],
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED', 'COMPLETED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent conflicting show schedules for the same screen at the same time
showSchema.index(
  { theatre: 1, screenId: 1, date: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: 'ACTIVE' } }
);

/**
 * Generate seats array according to screen dimensions and tier pricing
 */
showSchema.statics.generateSeats = function (totalRows = 8, seatsPerRow = 12, pricing = {}) {
  const standardPrice = pricing.standard || 12.0;
  const premiumPrice = pricing.premium || 16.0;
  const vipPrice = pricing.vip || 22.0;

  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seats = [];

  for (let r = 0; r < Math.min(totalRows, rowLetters.length); r++) {
    const rowChar = rowLetters[r];

    // Determine tier based on row
    let tier = 'standard';
    let price = standardPrice;

    if (r < 2) {
      tier = 'vip'; // Recliner / front-tier VIP experience
      price = vipPrice;
    } else if (r < 5) {
      tier = 'premium'; // Prime central rows
      price = premiumPrice;
    }

    for (let c = 1; c <= seatsPerRow; c++) {
      seats.push({
        seatNumber: `${rowChar}${c}`,
        row: rowChar,
        column: c,
        tier,
        price,
        status: 'AVAILABLE',
        heldBy: null,
        holdExpiresAt: null,
      });
    }
  }

  return seats;
};

const Show = mongoose.model('Show', showSchema);
export default Show;
